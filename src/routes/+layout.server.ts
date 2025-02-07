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
	// Remove language prefix from URI before making the GraphQL query
	uri = uri.replace(/^\/(en|ar)/, '')
	
	if (uri === '') {
		uri = '/'
	}
	
	const specialRoutes = [
		'/library',
		'/library/',
		'/learning-hub',
		'/learning-hub/',
		'/ar/library',
		'/ar/library/',
		'/ar/learning-hub',
		'/ar/learning-hub/',
		'/en/library',
		'/en/library/',
		'/en/learning-hub',
		'/en/learning-hub/'
	]

	// Check if current URI matches any of the special routes or their sub-routes
	const isSpecialRoute = specialRoutes.some((route) => uri === route || uri.startsWith(`${route}/`))

	try {
		const response = await graphqlQuery(PageMeta, { uri: uri })
		checkResponse(response)

		const { data }: { data: PageMetaQuery } = await response.json()

		// Only check for page data if it's not a special route
		if (!data.page && !isSpecialRoute) {
			error(404, 'Sorry, this page does not exist')
		}

		// Modify menu items to add 'current' key
		if (data.menu?.menuItems?.nodes) {
			data.menu.menuItems.nodes = data.menu.menuItems.nodes.map((node) => ({
				...node,
				current: node.uri === uri
			}))
		}

		if (!data.menu) {
			console.error('Menu data check failed:', data.menu)
			error(500, 'Missing menu data')
		}

		const lang = params.lang || 'en'

		// Handle SEO data more gracefully
		let seoData = data.page?.seo
		if (seoData?.opengraphUrl) {
			const siteUrl = seoData.opengraphUrl.replace(
				new URL(seoData.opengraphUrl).origin,
				PUBLIC_SITE_URL
			)
			seoData = { ...seoData, opengraphUrl: siteUrl }
		} else {
			// Provide fallback SEO data
			seoData = {
				title: 'Decolonizing the Page',
				metaDesc: 'Decolonizing the Page',
				opengraphUrl: `${PUBLIC_SITE_URL}${uri}`,
				opengraphImage: null
				// Add other required SEO fields with default values
			}
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
			translations: data.page?.translations || [],
			seo: seoData,
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
