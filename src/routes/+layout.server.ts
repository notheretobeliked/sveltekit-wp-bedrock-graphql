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
}

export const load: LayoutServerLoad<LoadReturn> = async function load({ params }) {
	const uri = `/${params.all || ''}`

	try {
		const response = await graphqlQuery(PageMeta, { uri: uri })
		checkResponse(response)

		// Assuming CombinedQueryResponse is correctly typed to reflect your GraphQL query structure
		const { data }: { data: PageMetaQuery } = await response.json()

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
      menu: data.menu,
      languageCode: (data.page && '__typename' in data.page &&
          (data.page.__typename === 'Page' || data.page.__typename === 'Post'))
          ? data.page.languageCode
          : 'en',
      translations: (data.page && '__typename' in data.page &&
          (data.page.__typename === 'Page' || data.page.__typename === 'Post'))
          ? data.page.translations || []
          : [],
      seo: data.page?.seo 
          ? { ...data.page.seo, opengraphUrl: siteUrl }
          : error(500, 'Missing SEO data'),
      uri
  } satisfies LoadReturn
	} catch (err: unknown) {
		const httpError = err as { status: number; message: string }
		if (httpError.message) {
			error(httpError.status ?? 500, httpError.message)
		}
		error(500, err as string)
	}
}
