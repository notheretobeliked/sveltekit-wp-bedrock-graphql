export const prerender = false

import PageMeta from '$lib/graphql/query/menu.graphql?raw'
import type { PageMetaQuery } from '$lib/graphql/generated'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import type { LayoutServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { PUBLIC_SITE_URL } from '$env/static/public' // Ensure this import is correct
import { labelTranslations } from '$lib/labeltranslations'
interface LoadReturn {
	data: PageMetaQuery
	labelTranslations: typeof labelTranslations
	menu: NonNullable<PageMetaQuery['menu']>
	languageCode: NonNullable<PageMetaQuery['page']>['languageCode']
	translations: NonNullable<NonNullable<PageMetaQuery['page']>['translations']>
	seo: NonNullable<NonNullable<PageMetaQuery['page']>['seo']>
	uri: string
	lang: string // Add this line
}

export const load: LayoutServerLoad<LoadReturn> = async function load({ params, url }) {
	let uri = url.pathname
	if (uri === '/en' || uri === '/ar') {
		uri = '/'
	}

	try {
		const response = await graphqlQuery(PageMeta, { uri: uri })
		checkResponse(response)

		// Assuming CombinedQueryResponse is correctly typed to reflect your GraphQL query structure
		const { data }: { data: PageMetaQuery } = await response.json()

		// First check if we have a valid page
		if (!data.page) {
			error(404, 'Page not found')
		}

		// Modify menu items to add 'current' key
		if (data.menu && data.menu.menuItems && data.menu.menuItems.nodes) {
			data.menu.menuItems.nodes = data.menu.menuItems.nodes.map((node) => ({
				...node,
				current: node.uri === uri
			}))
		}

		if (!data.page?.seo?.opengraphUrl) {
			console.error('SEO data check failed:', data.page?.seo)
			error(500, 'Missing required SEO data')
		}

		if (!data.menu) {
			console.error('Menu data check failed:', data.menu)
			error(500, 'Missing menu data')
		}

		const siteUrl = data.page.seo.opengraphUrl.replace(
			new URL(data.page.seo.opengraphUrl).origin,
			PUBLIC_SITE_URL
		)

		// Add a log before the return to ensure we're getting here
		console.log('About to return data with siteUrl:', siteUrl)

		const lang = params.lang || 'en' // Get the lang from the URL params, default to 'en'

		// Assuming your GraphQL query correctly fetches the SEO data as per your LayoutAPIResponse type
		// Now `data` is already of type LayoutAPIResponse, including menu and SEO content
		if (!data.menu) {
			error(500, 'Missing menu data')
		}
		return {
			data,
			labelTranslations,
			lang,
			menu: data.menu,
			languageCode:
				data.page &&
				'__typename' in data.page &&
				(data.page.__typename === 'Page' || data.page.__typename === 'Post')
					? data.page.languageCode
					: 'en',
			translations:
				data.page &&
				'__typename' in data.page &&
				(data.page.__typename === 'Page' || data.page.__typename === 'Post')
					? data.page.translations || []
					: [],
			seo: data.page?.seo
				? { ...data.page.seo, opengraphUrl: siteUrl }
				: error(500, 'Missing SEO data'),
			uri
		} satisfies LoadReturn
	} catch (err: unknown) {
		// Check if it's a response error from the GraphQL query
		if (err instanceof Response) {
			error(err.status, await err.text())
		}

		// Check if it's a SvelteKit HttpError
		if (err && typeof err === 'object' && 'status' in err && 'body' in err) {
			const httpError = err as { status: number; body: { message: string } }
			error(httpError.status, httpError.body.message)
		}

		// Check if it's our known error type
		const httpError = err as { status?: number; message: string }
		if (httpError.status && httpError.message) {
			error(httpError.status, httpError.message)
		}

		// Fallback for unknown errors
		console.error('Unhandled error:', err)
		error(500, 'An unexpected error occurred')
	}
}
