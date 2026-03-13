import { PUBLIC_SITE_URL } from '$env/static/public'
import type { RequestHandler } from './$types'

export const GET: RequestHandler = async () => {
	const siteUrl = PUBLIC_SITE_URL.replace(/\/$/, '')

	const body = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml`

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'max-age=86400'
		}
	})
}
