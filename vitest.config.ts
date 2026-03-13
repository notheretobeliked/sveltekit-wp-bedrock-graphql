import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
	test: {
		include: ['src/**/*.test.ts'],
		environment: 'node'
	},
	resolve: {
		alias: {
			'$lib': path.resolve('./src/lib'),
			'$components': path.resolve('./src/components'),
			'$env/static/private': path.resolve('./src/lib/__mocks__/env.ts')
		}
	}
})
