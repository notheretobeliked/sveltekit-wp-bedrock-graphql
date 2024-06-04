import PageMeta from '$lib/graphql/query/menu.graphql?raw'
import type { LayoutAPIResponse } from '$lib/types/wp-types'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import type { PageServerLoad } from './$types'
import { error } from '@sveltejs/kit'
import { PUBLIC_SITE_URL } from '$env/static/public'; // Ensure this import is correct



export const load: PageServerLoad = async function load({ params }) {
  const uri = `/${params.all || ''}`

  try {
    const response = await graphqlQuery(PageMeta, { uri: uri })
    checkResponse(response)

    // Assuming CombinedQueryResponse is correctly typed to reflect your GraphQL query structure
    const { data }: { data: LayoutAPIResponse } = await response.json()

    // Modify menu items to add 'current' key
    if (data.menu && data.menu.menuItems && data.menu.menuItems.nodes) {
      data.menu.menuItems.nodes = data.menu.menuItems.nodes.map(node => ({
        ...node,
        current: node.uri === uri,
      }))
    }

    const siteUrl = data.page.seo.opengraphUrl.replace(new URL(data.page.seo.opengraphUrl).origin, PUBLIC_SITE_URL);
    


    // Assuming your GraphQL query correctly fetches the SEO data as per your LayoutAPIResponse type
    // Now `data` is already of type LayoutAPIResponse, including menu and SEO content

    return {
      data: data,
      menu: data.menu,
      seo: { ...data.page.seo, opengraphUrl: siteUrl }, // Update seo with the new siteUrl
      uri: uri,
    } // Directly return the data which now includes menu, SEO, and uri
  } catch (err: unknown) {
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      error(httpError.status ?? 500, httpError.message)
    }
    error(500, err as string)
  }
}
