import 'dotenv/config'
import { expect, test } from '@playwright/test'

/**
 * Cross-checks rendered accordion state against what WordPress actually reports.
 *
 * WP 7.0 moved `openByDefault` from core/accordion-panel to core/accordion-item,
 * and wp-graphql-content-blocks returned null for it rather than failing, so every
 * accordion silently rendered collapsed. Nothing caught it. Asserting the DOM
 * against the API — rather than against hardcoded fixture content — keeps this
 * meaningful across the sites built from this template, whatever their content.
 */

const ACCORDION_QUERY = `
	query AccordionState($uri: String = "/") {
		nodeByUri(uri: $uri) {
			... on Page {
				editorBlocks(flat: true) {
					name
					... on CoreAccordionItem {
						attributes {
							openByDefault
						}
					}
				}
			}
		}
	}
`

async function fetchExpectedState(): Promise<boolean[] | null> {
	const endpoint = process.env.GRAPHQL_ENDPOINT

	if (!endpoint) return null

	let json
	try {
		const response = await fetch(endpoint, {
			method: 'POST',
			headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ query: ACCORDION_QUERY, variables: { uri: '/' } })
		})
		if (!response.ok) return null
		json = await response.json()
	} catch {
		return null
	}

	// A partial failure here is itself the bug this guards against, so treat it as fatal.
	expect(json.errors, `GraphQL errors: ${JSON.stringify(json.errors)}`).toBeUndefined()

	const blocks = json.data?.nodeByUri?.editorBlocks

	if (!Array.isArray(blocks)) return null

	return blocks
		.filter((block) => block.name === 'core/accordion-item')
		.map((block) => block.attributes?.openByDefault === true)
}

test.describe('accordion blocks', () => {
	test('initial open state matches openByDefault from WordPress', async ({ page }) => {
		const expected = await fetchExpectedState()

		test.skip(expected === null, 'WordPress backend unavailable')
		test.skip(expected!.length === 0, 'Homepage has no accordion items')

		await page.goto('/')

		const toggles = page.locator('.accordion > button')
		await expect(toggles).toHaveCount(expected!.length)

		await expect
			.poll(() =>
				toggles.evaluateAll((nodes) =>
					nodes.map((node) => node.getAttribute('aria-expanded') === 'true')
				)
			)
			.toEqual(expected)
	})

	test('toggling an accordion flips its expanded state', async ({ page }) => {
		const expected = await fetchExpectedState()

		test.skip(expected === null, 'WordPress backend unavailable')
		test.skip(expected!.length === 0, 'Homepage has no accordion items')

		await page.goto('/')

		const toggle = page.locator('.accordion > button').first()
		const initial = expected![0]

		await toggle.click()
		await expect(toggle).toHaveAttribute('aria-expanded', String(!initial))

		await toggle.click()
		await expect(toggle).toHaveAttribute('aria-expanded', String(initial))
	})
})
