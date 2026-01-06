import { WORDPRESS_URL } from '$env/static/private'
export const prerender = false // Disable prerendering for preview functionality

import PageContent from '$lib/graphql/query/page.graphql?raw'
import PageContentWithPreview from '$lib/graphql/query/page-with-preview.graphql?raw'
import PreviewById from '$lib/graphql/query/preview-by-id.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { checkWordPressAuth, canUserPreview } from '$lib/server/wordpress-auth'
import { error, isHttpError, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { EditorBlock } from '$lib/types/wp-types'
import { flatListToHierarchical } from '$lib/server/utilities'

export const load: PageServerLoad = async function load({ params, url, fetch, request }) {
	const uri = `/${params.all || ''}`.replace(/\/+/g, '/') // Normalize multiple slashes
	
	// Check if this is a preview request
	const isPreview = url.searchParams.has('preview') || url.searchParams.has('p') || url.searchParams.has('page_id')
	const previewId = url.searchParams.get('p') || url.searchParams.get('page_id') // WordPress preview by ID
	const previewToken = url.searchParams.get('token') // Preview token from WordPress

	if (uri.match(/\.(jpg|png|gif|svg|css|js)$/i)) {
		error(404, 'Not a page route')
	}

	// Handle authentication for previews
	let authResult: { authenticated: boolean; token?: string } = { authenticated: false }
	if (isPreview) {
		// Check if we have a preview token from the URL
		if (previewToken) {
			authResult = { 
				authenticated: true, 
				token: previewToken 
			}
		} else {
			// No token provided - redirect to WordPress to get one
			const returnUrl = encodeURIComponent(url.href)
			const loginUrl = `${WORDPRESS_URL}/wp/wp-login.php?redirect_to=${returnUrl}`
			throw redirect(302, loginUrl)
		}
	}

	try {
		let pageResponse: Response

		if (isPreview && previewId && previewToken) {
			// Use preview query by ID with token authentication
			pageResponse = await graphqlQuery(
				PreviewById, 
				{ 
					id: previewId
				},
				{
					token: previewToken
				}
			)
		} else if (isPreview && previewId) {
			// Preview request with ID but no token - use the complex query
			pageResponse = await graphqlQuery(
				PageContentWithPreview, 
				{ 
					id: previewId,
					asPreview: true,
					includePreview: true
				},
				{
					includeAuth: true,
					request: request,
					token: authResult.token
				}
			)
		} else if (isPreview) {
			// Preview request but no ID - try by URI with preview enabled
			pageResponse = await graphqlQuery(
				PageContentWithPreview, 
				{ 
					uri: uri,
					includePreview: true,
					asPreview: false
				},
				{
					includeAuth: true,
					request: request,
					token: authResult.token
				}
			)
		} else {
			// Use regular query for public content
			pageResponse = await graphqlQuery(PageContent, { uri: uri })
		}

		checkResponse(pageResponse)
		const pageData = await pageResponse.json()

		// Handle GraphQL errors
		if (pageData.errors) {
			error(500, 'GraphQL query failed')
		}

		// Check if we have content
		const node = pageData?.data?.page || pageData?.data?.post || pageData?.data?.nodeByUri
		
		if (!node) {
			// For previews, try to be more helpful
			if (isPreview && previewId) {
				error(404, `Preview not found for post ID: ${previewId}`)
			}
			error(404, `Page not found for URI: ${uri}`)
		}

		// Additional preview validation
		if (isPreview && node) {
			// Ensure we can actually see this preview content
			if (node.status && !['publish', 'draft', 'private', 'pending', 'inherit'].includes(node.status)) {
				error(404, 'Preview not available')
			}
		}

		let editorBlocks: EditorBlock[] = node?.editorBlocks
			? flatListToHierarchical(node.editorBlocks)
			: []

		return {
			data: pageData.data,
			uri: uri,
			editorBlocks: editorBlocks,
			isPreview: isPreview,
			authenticated: authResult.authenticated,
			// Include preview-specific metadata
			...(isPreview && node && {
				previewData: {
					status: node.status || 'unknown',
					lastModified: node.modified || node.date,
					canEdit: authResult.authenticated
				}
			})
		}
	} catch (err: unknown) {
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