import { test, expect } from '@playwright/test'

test.describe('smoke tests', () => {
	test('homepage loads and renders blocks', async ({ page }) => {
		await page.goto('/')
		await expect(page).toHaveTitle(/.+/)
		// At least one block should render
		const blocks = page.locator('[class*="core-"]')
		await expect(blocks.first()).toBeVisible()
	})

	test('navigation menu is present', async ({ page }) => {
		await page.goto('/')
		const nav = page.locator('nav')
		await expect(nav.first()).toBeVisible()
	})

	test('skip link is present and focusable', async ({ page }) => {
		await page.goto('/')
		const skipLink = page.locator('a[href="#main-content"]')
		await expect(skipLink).toBeAttached()
		await skipLink.focus()
		await expect(skipLink).toBeVisible()
	})

	test('main content landmark exists', async ({ page }) => {
		await page.goto('/')
		const main = page.locator('#main-content')
		await expect(main).toBeAttached()
	})

	test('html has lang attribute', async ({ page }) => {
		await page.goto('/')
		const lang = await page.locator('html').getAttribute('lang')
		expect(lang).toBeTruthy()
	})
})

test.describe('SEO routes', () => {
	test('sitemap.xml returns valid XML', async ({ request }) => {
		const response = await request.get('/sitemap.xml')
		expect(response.status()).toBe(200)
		expect(response.headers()['content-type']).toContain('xml')
		const body = await response.text()
		expect(body).toContain('<urlset')
		expect(body).toContain('<loc>')
	})

	test('robots.txt returns valid content', async ({ request }) => {
		const response = await request.get('/robots.txt')
		expect(response.status()).toBe(200)
		const body = await response.text()
		expect(body).toContain('User-agent')
		expect(body).toContain('Sitemap')
	})
})

test.describe('system route guard', () => {
	test('non-page requests like favicon do not trigger a WordPress query', async ({ request }) => {
		const response = await request.get('/favicon.ico')
		// A 404 (no file) or 200 (file exists) are both fine.
		// A 500 would mean the layout tried to query WordPress for this path.
		expect(response.status()).not.toBe(500)
	})
})
