export const prerender = false

import type { PageServerLoad } from './$types'
import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { EditorBlock } from '$lib/types/wp-types'
import { flatListToHierarchical } from '$lib/server/utilities'

export const load = (async ({ params, url, fetch, parent }) => {
	console.log('Lang param:', params.lang) // Check language parameter
	const parentData = await parent()
	console.log('Parent data:', parentData) // Check parent data structure

	const uri = url.pathname
	console.log(uri)


	try {
		const response = await graphqlQuery(PageContent, { uri })
		checkResponse(response)
		const { data } = await response.json()

		if (!data || !data.nodeByUri) {
			throw error(404, { message: 'Page not found' })
		}
		const editorBlocks: EditorBlock[] = data.nodeByUri.editorBlocks
			? flatListToHierarchical(data.nodeByUri.editorBlocks)
			: []

		return {
			data,
			uri,
			editorBlocks
		}
	} catch (err: unknown) {
		console.error('Server Error:', err)
		const httpError = err as { status: number; message: string }
		if (httpError.message) {
			throw error(httpError.status ?? 500, httpError.message)
		}
		throw error(500, 'Internal Server Error')
	}
}) satisfies PageServerLoad
