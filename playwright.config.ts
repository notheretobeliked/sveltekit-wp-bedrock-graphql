import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: 'e2e',
	timeout: 30000,
	retries: 0,
	use: {
		baseURL: process.env.BASE_URL || 'http://localhost:5173',
		trace: 'on-first-retry'
	},
	projects: [
		{
			name: 'chromium',
			use: { browserName: 'chromium' }
		}
	]
})
