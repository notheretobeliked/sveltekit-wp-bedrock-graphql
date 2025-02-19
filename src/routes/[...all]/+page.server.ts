export const prerender = true

import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { EditorBlock } from '$lib/types/wp-types'
import { flatListToHierarchical } from '$lib/server/utilities'

export const load: PageServerLoad = async function load({ params, url, fetch }) {
	const uri = `/${params.all || ''}`.replace(/\/+/g, '/') // Normalize multiple slashes
	
	// Add debugging
	console.log('Attempting to fetch URI:', uri)

	if (uri.match(/\.(jpg|png|gif|svg|css|js)$/i)) {
		throw error(404, {
			message: 'Not a page route'
		})
	}

	try {
		const response = await graphqlQuery(PageContent, { uri: uri })
		checkResponse(response)
		const { data } = await response.json()

		// Add debugging
		console.log('GraphQL response:', JSON.stringify(data, null, 2))

		// Only throw 404 if we truly have no data to work with
		if (!data || !data.nodeByUri) {
			throw error(404, {
				message: `Page not found for URI: ${uri}`  // Enhanced error message
			})
		}

		let editorBlocks: EditorBlock[] = data.nodeByUri.editorBlocks
			? flatListToHierarchical(data.nodeByUri.editorBlocks)
			: []

		return {
			data: data,
			uri: uri,
			editorBlocks: editorBlocks
		}
	} catch (err: unknown) {
		console.error('Server Error:', err)
		const httpError = err as { status: number; message: string }
		if (httpError.message) {
			throw error(httpError.status ?? 500, httpError.message)
		}
		throw error(500, 'Internal Server Error')
	}
}
