import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
		alias: {
			$components: 'src/components',
			$types: 'src/types',
			$stores: 'src/stores'
		},
		prerender: {
			handleMissingId: 'warn',
			entries: ['/']
		}
	}
}

export default config
