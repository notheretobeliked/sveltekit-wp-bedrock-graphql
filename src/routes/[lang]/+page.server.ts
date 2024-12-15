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

	const lang = params.lang
	let uri: string

	if (lang === 'en') {
		uri = '/'
	} else if (lang === 'ar') {
		const arTranslation = parentData.data.page.translations.find((t) => t.languageCode === 'ar')
		console.log('AR translation:', arTranslation) // Check Arabic translation data
		uri = arTranslation ? `/${arTranslation.slug}` : '/'
	} else {
		uri = '/'
	}

	console.log('Final URI:', uri) // Check what URI is being used

	// Fetch books from API route
	const booksResponse = await fetch(`/api/library-items?lang=${lang}`)
	const books = await booksResponse.json()
	console.log('Books response:', books) // Check books data

	try {
		const response = await graphqlQuery(PageContent, { uri })
		console.log('GraphQL response:', response) // Check raw GraphQL response
		checkResponse(response)
		const { data } = await response.json()
		console.log('Parsed data:', data) // Check parsed data

		if (!data || !data.nodeByUri) {
			console.log('No data or nodeByUri found') // Debug 404 condition
			throw error(404, { message: 'Page not found' })
		}
		const editorBlocks: EditorBlock[] = data.nodeByUri.editorBlocks
			? flatListToHierarchical(data.nodeByUri.editorBlocks)
			: []

		return {
			books,
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
