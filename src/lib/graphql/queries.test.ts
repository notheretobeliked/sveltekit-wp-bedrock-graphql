import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { buildSchema, parse, validate } from 'graphql'

/**
 * Validates every query document against a snapshot of the WordPress GraphQL
 * schema (`pnpm schema` regenerates it).
 *
 * This is the guard against WordPress core changing block attributes underneath
 * us. WP 7.0, for example, dropped `textAlign` from core/heading and
 * core/paragraph and moved `openByDefault` from core/accordion-panel to
 * core/accordion-item — each of which silently returned null rather than
 * failing, so the only symptom was a block rendering wrong.
 *
 * Unlike `pnpm codegen`, this runs offline and covers the preview queries,
 * which codegen explicitly excludes.
 */

const queryDir = resolve(__dirname, 'query')
const schema = buildSchema(readFileSync(resolve(__dirname, 'schema.graphql'), 'utf8'))

const queryFiles = readdirSync(queryDir).filter((file) => file.endsWith('.graphql'))

describe('GraphQL query documents', () => {
	it('finds query files to validate', () => {
		expect(queryFiles.length).toBeGreaterThan(0)
	})

	it.each(queryFiles)('%s is valid against the schema', (file) => {
		const source = readFileSync(resolve(queryDir, file), 'utf8')
		const errors = validate(schema, parse(source))

		expect(
			errors.map((e) => {
				const line = e.locations?.[0]?.line
				return line ? `${file}:${line} ${e.message}` : `${file} ${e.message}`
			})
		).toEqual([])
	})
})
