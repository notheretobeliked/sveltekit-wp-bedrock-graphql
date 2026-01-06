import adapter from '@sveltejs/adapter-auto'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	onwarn: (warning, handler) => {
		// suppress warnings on `vite dev` and `vite build`
		if (warning.code === 'a11y-click-events-have-key-events') return
		if (warning.code === 'a11y-no-static-element-interactions') return
		handler(warning)
	},
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
