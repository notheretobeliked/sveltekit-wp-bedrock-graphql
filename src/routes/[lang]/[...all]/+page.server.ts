import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { EditorBlock } from '$lib/types/wp-types'
import { flatListToHierarchical } from '$lib/server/utilities'

export const load: PageServerLoad = async function load({ params, url, fetch }) {
  const uri = `/${params.all || ''}`

    console.log(uri)
  // Fetch books from API route
  const booksResponse = await fetch(`/api/library-items?lang=${params.lang}`)
  const books = await booksResponse.json()

  try {
    const response = await graphqlQuery(PageContent, { uri: uri })
    checkResponse(response)
    const { data } = await response.json()

    if (!data || !data.nodeByUri) {
      throw error(404, {
        message: 'Page not found in +page.server.ts',
      })
    }

    let editorBlocks: EditorBlock[] = data.nodeByUri.editorBlocks 
      ? flatListToHierarchical(data.nodeByUri.editorBlocks) 
      : []

    return {
      books,
      data: data,
      uri: uri,
      editorBlocks: editorBlocks,
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
