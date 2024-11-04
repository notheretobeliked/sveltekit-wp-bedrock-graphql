export const prerender = false

import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { flatListToHierarchical } from '$lib/utilities/utilities'

// ... existing imports ...

export const load: PageServerLoad = async function load({ params, url, parent }) {

	const parentData = await parent();

	console.log(parentData)
	
	const lang = params.lang;
	let uri: string;

	if (lang === 'en') {
		uri = '/';
	} else if (lang === 'ar') {
		const arTranslation = parentData.translations.find(t => t.languageCode === 'ar');
		uri = arTranslation ? arTranslation.slug : '/';
	} else {
		// Default to '/' if lang is neither 'en' nor 'ar'
		uri = '/';
	}

	console.log('Determined URI:', uri);

	try {
		const response = await graphqlQuery(PageContent, { uri: uri })
		checkResponse(response)
		
		const responseData = await response.json()
		
		// Log the entire response
		//  console.log('GraphQL response:', JSON.stringify(responseData, null, 2))

		// Check if responseData has the expected structure
		if (!responseData || typeof responseData !== 'object' || !('data' in responseData)) {
			console.error('Unexpected response structure:', responseData)
			throw new Error('Invalid GraphQL response structure')
		}

		const { data } = responseData
		

		// Check if data.page exists
		if (!data || !data.page) {
			console.error('Page data not found in response:', data)
			error(404, {
				message: 'Page not found'
			})
		}

		let editorBlocks = data.page.editorBlocks ? flatListToHierarchical(data.page.editorBlocks) : []
	
		return {
			data: data,
			uri: uri,
			editorBlocks: editorBlocks,
			languageCode: params.lang
		}
	} catch (err: unknown) {
		console.error('Error in load function:', err)
		if (err instanceof Error) {
			error(500, err.message)
		} else {
			error(500, 'An unexpected error occurred')
		}
	}
}
