import SitemapQuery from '$lib/graphql/query/sitemap.graphql?raw'
import { graphqlQuery, checkResponse } from '$lib/utilities/graphql'
import { PUBLIC_SITE_URL } from '$env/static/public'
import type { RequestHandler } from './$types'

interface ContentNode {
	uri: string
	modifiedGmt: string | null
}

interface SitemapData {
	pages: { nodes: ContentNode[] }
	posts: { nodes: ContentNode[] }
}

export const GET: RequestHandler = async () => {
	const response = await graphqlQuery(SitemapQuery, {})
	checkResponse(response)

	const json = await response.json()
	const data: SitemapData = json.data

	const siteUrl = PUBLIC_SITE_URL.replace(/\/$/, '')
	const nodes = [...(data.pages?.nodes ?? []), ...(data.posts?.nodes ?? [])]

	const urls = nodes.map((node) => {
		const loc = `${siteUrl}${node.uri}`
		const lastmod = node.modifiedGmt
			? new Date(node.modifiedGmt + 'Z').toISOString().split('T')[0]
			: undefined

		return `  <url>
    <loc>${escapeXml(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}
  </url>`
	})

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600'
		}
	})
}

function escapeXml(str: string): string {
	return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}
