export const prerender = true

import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error, isHttpError } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { EditorBlock } from '$lib/types/wp-types'
import { flatListToHierarchical, normalizeAssetUrlsInObject } from '$lib/server/utilities'

export const load: PageServerLoad = async function load({ params, url, fetch }) {
	const uri = `/${params.all || ''}`.replace(/\/+/g, '/') // Normalize multiple slashes

	// Handle system routes and static assets
	const systemRoutes = [
		'/.well-known',
		'/apple-touch-icon',
		'/favicon',
		'/robots.txt',
		'/sitemap.xml'
	]

	const isSystemRoute = systemRoutes.some(route => uri.startsWith(route))
	const isStaticAsset = uri.match(/\.(jpg|png|gif|svg|css|js|ico|webp|avif)$/i)

	if (isSystemRoute || isStaticAsset) {
		error(404, 'Not a page route')
	}

	try {
		const pageResponse = await graphqlQuery(PageContent, { uri: uri })
		checkResponse(pageResponse)
		const pageData = await pageResponse.json()

		// Only throw 404 if we truly have no page data to work with
		if (!pageData?.data?.nodeByUri) {
			error(404, `Page not found for URI: ${uri}`)
		}

		// Normalize asset URLs in page data if CDN is configured
		normalizeAssetUrlsInObject(pageData)

		let editorBlocks: EditorBlock[] = pageData.data.nodeByUri.editorBlocks
			? flatListToHierarchical(pageData.data.nodeByUri.editorBlocks, {}, pageData.data)
			: []

		return {
			data: pageData.data,
			uri: uri,
			editorBlocks: editorBlocks
		}
	} catch (err: unknown) {
		console.error('Server Error:', err)

		// Check if it's already an HTTP error (like a 404)
		if (isHttpError(err)) {
			throw err
		}

		// Check if it's a response with status
		if (err instanceof Response) {
			const status = err.status
			if (status === 404) {
				error(404, `Page not found for URI: ${uri}`)
			}
			error(status || 500, `Error fetching page: ${await err.text()}`)
		}

		// For errors with status property (from GraphQL or other sources)
		const httpError = err as { status?: number; message?: string }
		if (httpError.status === 404 ||
		    (httpError.message && httpError.message.includes('not found'))) {
			error(404, httpError.message || `Page not found for URI: ${uri}`)
		}

		// For any other error
		const errorMessage = err instanceof Error ? err.message : 'Internal Server Error'
		error(500, errorMessage)
	}
}
