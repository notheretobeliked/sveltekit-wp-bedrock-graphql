import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	onwarn: (warning, handler) => {
		// suppress warnings on `vite dev` and `vite build`; but even without this, things still work
		if (warning.code === 'a11y-click-events-have-key-events') return
		if (warning.code === 'a11y-no-static-element-interactions') return
		handler(warning)
	},
	kit: {
		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			$components: 'src/components',
			$types: 'src/types',
			$stores: 'src/stores'
		},
		prerender: {
			handleMissingId: 'warn',
			entries: [
				'/en', // English version of the library page
				'/ar', // Arabic version of the library page
				'/ar/library', // Arabic version of the library page
				'/en/library', // Arabic version of the library page
				'/',
				'/api/library-items'
			], // Prerender all routes
			handleHttpError: ({ path, referrer, message }) => {
				// Create an array of paths to ignore
				const ignorePaths = ['/', '/api/library-items']
				if (ignorePaths.includes(path)) {
					return
				}
				throw new Error(message)
			}
		}
	}
}

export default config
