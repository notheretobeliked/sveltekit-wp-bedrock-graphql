import PageMeta from '$lib/graphql/query/menu.graphql?raw'
import type { PageMetaQuery } from '$lib/graphql/generated'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import type { LayoutServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { PUBLIC_SITE_URL } from '$env/static/public' // Ensure this import is correct
interface LoadReturn {
	data: PageMetaQuery
	menu: NonNullable<PageMetaQuery['menu']>
	seo: NonNullable<NonNullable<PageMetaQuery['page']>['seo']>
	uri: string
}

export const load: LayoutServerLoad<LoadReturn> = async function load({ params, url }) {

	let uri = url.pathname
	// Remove language prefix from URI before making the GraphQL query	
	if (uri === '') {
		uri = '/'
	}

	try {
		const response = await graphqlQuery(PageMeta, { uri: uri })
		checkResponse(response)

		const { data }: { data: PageMetaQuery } = await response.json()

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
				title: 'Website title',
				metaDesc: 'Meta data about the website',
				opengraphUrl: `${PUBLIC_SITE_URL}${uri}`,
				opengraphImage: null
				// Add other required SEO fields with default values
			}
		}

		return {
			data,
			menu: data.menu,
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
