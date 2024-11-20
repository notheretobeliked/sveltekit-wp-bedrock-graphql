export const prerender = true
import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { EditorBlock } from '$lib/types/wp-types'
import {flatListToHierarchical} from '$lib/server/utilities'
import {restructureLibraryItems} from '$lib/server/utilities'


export const load: PageServerLoad = async function load({ params, url, locals }) {
  const uri = `/${params.all || ''}`
  const books = locals.books
    
  // Restructure the books data
  const restructuredData = restructureLibraryItems({ books: { nodes: books } })

  try {
    const response = await graphqlQuery(PageContent, { uri: uri })
    checkResponse(response)
    const { data } = await response.json()

    // Add debug logging
    console.log('GraphQL Response:', data)

    // Check if data or nodeByUri is null
    if (!data || !data.nodeByUri) {
      throw error(404, {
        message: 'Page not found',
      })
    }

    let editorBlocks: EditorBlock[] = data.nodeByUri.editorBlocks 
      ? flatListToHierarchical(data.nodeByUri.editorBlocks) 
      : []

    return {
      books: restructuredData,
      data: data,
      uri: uri,
      editorBlocks: editorBlocks,
    }
  } catch (err: unknown) {
    console.error('Server Error:', err) // Add error logging
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      throw error(httpError.status ?? 500, httpError.message)
    }
    throw error(500, 'Internal Server Error')
  }
}
