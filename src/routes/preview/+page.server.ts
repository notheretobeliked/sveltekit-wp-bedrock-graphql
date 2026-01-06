import { WORDPRESS_URL } from '$env/static/private'
import PreviewById from '$lib/graphql/query/preview-by-id.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error, isHttpError, redirect } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { EditorBlock } from '$lib/types/wp-types'
import { flatListToHierarchical, normalizeAssetUrlsInObject } from '$lib/server/utilities'

export const prerender = false // Disable prerendering for preview functionality

export const load: PageServerLoad = async function load({ url }) {
	// Check if this is a preview request
	const isPreview = url.searchParams.has('preview') || url.searchParams.has('p') || url.searchParams.has('page_id')
	const previewId = url.searchParams.get('p') || url.searchParams.get('page_id')
	const previewToken = url.searchParams.get('token')

	// Handle authentication for previews
	let authResult: { authenticated: boolean; token?: string } = { authenticated: false }
	if (isPreview) {
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
				{ id: previewId },
				{ token: previewToken }
			)
		} else {
			// Fallback - shouldn't normally reach here
			error(400, 'Preview requires a post ID and token')
		}

		checkResponse(pageResponse)
		const pageData = await pageResponse.json()

		// Handle GraphQL errors
		if (pageData.errors) {
			console.error('GraphQL errors:', pageData.errors)
			error(500, 'GraphQL query failed')
		}

		// Check if we have content - try both page and post
		const node = pageData?.data?.page || pageData?.data?.post

		if (!node) {
			error(404, `Preview not found for post ID: ${previewId}`)
		}

		// Validate preview status
		if (node.status && !['publish', 'draft', 'private', 'pending', 'inherit'].includes(node.status)) {
			error(404, 'Preview not available')
		}

		// Normalize asset URLs
		normalizeAssetUrlsInObject(pageData)

		let editorBlocks: EditorBlock[] = node?.editorBlocks
			? flatListToHierarchical(node.editorBlocks, {}, pageData.data)
			: []

		return {
			data: pageData.data,
			uri: '/',
			editorBlocks: editorBlocks,
			isPreview: true,
			authenticated: authResult.authenticated,
			previewData: {
				status: node.status || 'unknown',
				lastModified: node.modified || node.date,
				canEdit: authResult.authenticated
			}
		}
	} catch (err: unknown) {
		// Check if it's already an HTTP error (like a 404)
		if (isHttpError(err)) {
			throw err
		}

		// Check if it's a response with status
		if (err instanceof Response) {
			const status = err.status
			error(status || 500, `Error fetching preview: ${await err.text()}`)
		}

		// For errors with status property
		const httpError = err as { status?: number; message?: string }
		if (httpError.status) {
			error(httpError.status, httpError.message || 'Preview error')
		}

		// For any other error
		const errorMessage = err instanceof Error ? err.message : 'Internal Server Error'
		error(500, errorMessage)
	}
}
