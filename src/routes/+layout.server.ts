import PageMeta from '$lib/graphql/query/menu.graphql?raw'
import type { PageMetaQuery } from '$lib/graphql/generated'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import type { LayoutServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { PUBLIC_SITE_URL } from '$env/static/public'

// Default empty menu structure for graceful fallback
const emptyMenu = {
	menuItems: {
		nodes: [] as Array<{ label?: string | null; order?: number | null; uri?: string | null; current?: boolean }>
	}
}

interface LoadReturn {
	data: PageMetaQuery
	menu: typeof emptyMenu
	seo: NonNullable<NonNullable<PageMetaQuery['page']>['seo']>
	uri: string
}

export const load: LayoutServerLoad<LoadReturn> = async function load({ url }) {
	let uri = url.pathname
	if (uri === '') {
		uri = '/'
	}

	try {
		const response = await graphqlQuery(PageMeta, { uri })
		checkResponse(response)

		const json = await response.json()

		// Handle case where GraphQL returns errors or no data
		if (!json || !json.data) {
			console.error('GraphQL response missing data:', json)
			return {
				data: { menus: null, page: null } as unknown as PageMetaQuery,
				menu: emptyMenu,
				seo: {
					title: 'Website',
					metaDesc: '',
					opengraphUrl: `${PUBLIC_SITE_URL}${uri}`,
					opengraphImage: null
				},
				uri
			} satisfies LoadReturn
		}

		const data: PageMetaQuery = json.data

		// Extract menu from menus array (query by location returns array)
		const firstMenu = data.menus?.nodes?.[0]
		let menu = firstMenu ?? emptyMenu

		// Modify menu items to add 'current' key
		if (menu.menuItems?.nodes) {
			menu = {
				...menu,
				menuItems: {
					...menu.menuItems,
					nodes: menu.menuItems.nodes.map((node) => ({
						...node,
						current: node?.uri === uri
					}))
				}
			}
		}

		if (!firstMenu) {
			console.warn('No menu found in WordPress. Using empty menu fallback. Create a menu in WordPress under Appearance > Menus.')
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
			}
		}

		return {
			data,
			menu,
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
