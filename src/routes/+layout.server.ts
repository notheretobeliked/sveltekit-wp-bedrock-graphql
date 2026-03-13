import PageMeta from '$lib/graphql/query/menu.graphql?raw'
import type { PageMetaQuery } from '$lib/graphql/generated'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import type { LayoutServerLoad } from './$types'
import { error, isHttpError } from '@sveltejs/kit'
import { PUBLIC_SITE_URL } from '$env/static/public'

interface MenuItemWithCurrent {
	label?: string | null
	order?: number | null
	uri?: string | null
	current?: boolean
}

interface NormalizedMenu {
	menuItems?: {
		nodes: MenuItemWithCurrent[]
	} | null
}

const emptyMenu: NormalizedMenu = {
	menuItems: {
		nodes: []
	}
}

interface LoadReturn {
	data: PageMetaQuery
	menu: NormalizedMenu
	seo: Record<string, unknown>
	uri: string
}

/** Routes that should not trigger a GraphQL query */
const systemRoutes = [
	'/apple-touch-icon',
	'/apple-touch-icon-precomposed',
	'/.well-known',
	'/favicon',
	'/robots.txt',
	'/sitemap.xml',
	'/sitemap',
]

/** Normalize a path by stripping trailing slash (except root) */
function normalizePath(path: string): string {
	if (path === '/') return path
	return path.endsWith('/') ? path.slice(0, -1) : path
}

export const load: LayoutServerLoad<LoadReturn> = async function load({ url }) {
	let uri = url.pathname
	if (uri === '') {
		uri = '/'
	}

	// Skip GraphQL queries for system routes and static assets
	const isSystemRoute = systemRoutes.some(route => uri.startsWith(route))
	if (isSystemRoute) {
		return {
			data: { menus: null, page: null } as unknown as PageMetaQuery,
			menu: emptyMenu,
			seo: {
				title: '',
				metaDesc: '',
				opengraphUrl: `${PUBLIC_SITE_URL}${uri}`,
				opengraphImage: null
			},
			uri
		} satisfies LoadReturn
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

		// Modify menu items to add 'current' key (with trailing slash normalization)
		if (menu.menuItems?.nodes) {
			menu = {
				...menu,
				menuItems: {
					...menu.menuItems,
					nodes: menu.menuItems.nodes.map((node) => ({
						...node,
						current: normalizePath(node?.uri ?? '') === normalizePath(uri)
					}))
				}
			}
		}

		if (!firstMenu) {
			console.warn('No menu found in WordPress. Using empty menu fallback. Create a menu in WordPress under Appearance > Menus.')
		}

		// Handle SEO data — nodeByUri returns a union; Page and Post have seo
		type SeoNode = { seo?: Record<string, unknown> | null }
		const pageNode = data.page as (SeoNode & Record<string, unknown>) | null | undefined
		let seoData: Record<string, unknown> = pageNode?.seo ?? {}
		const ogUrl = typeof seoData.opengraphUrl === 'string' ? seoData.opengraphUrl : undefined
		if (ogUrl) {
			const siteUrl = ogUrl.replace(new URL(ogUrl).origin, PUBLIC_SITE_URL)
			seoData = { ...seoData, opengraphUrl: siteUrl }
		} else {
			// Provide fallback SEO data
			seoData = {
				title: '',
				metaDesc: '',
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
		// Let SvelteKit HttpErrors propagate (e.g. 404 from +page.server.ts)
		if (isHttpError(err)) {
			throw err
		}

		// Check if it's a response error from the GraphQL query
		if (err instanceof Response) {
			error(err.status, await err.text())
		}

		// Fallback for unknown errors
		const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred'
		console.error('Unhandled error in layout:', errorMessage)
		error(500, errorMessage)
	}
}
