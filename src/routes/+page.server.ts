import { redirect } from '@sveltejs/kit'

import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { flatListToHierarchical } from '$lib/server/utilities'

// ... existing imports ...

export const load: PageServerLoad = async function load({ params, url, request }) {
  // Get the Accept-Language header
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  // Check if Arabic is one of the preferred languages
  const prefersArabic = acceptLanguage.toLowerCase().includes('ar');
  
  // Redirect based on language preference
  throw redirect(307, prefersArabic ? '/ar' : '/en');

	const uri = `/`

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

		// Check if data exists
		if (!data || !data) {
			console.error('Page data not found in response:', data)
			error(404, {
				message: 'Page not found'
			})
		}

		let editorBlocks = data.editorBlocks ? flatListToHierarchical(data.editorBlocks) : []

		return {
			data: data,
			uri: uri,
			editorBlocks: editorBlocks
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
