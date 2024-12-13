export const prerender = true
import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { EditorBlock } from '$lib/types/wp-types'
import { flatListToHierarchical } from '$lib/server/utilities'

export const load: PageServerLoad = async function load({ params, url, fetch }) {
  const uri = url.pathname
  console.log(uri)
  
  try {
    const response = await graphqlQuery(PageContent, { uri: uri })
    checkResponse(response)
    const { data } = await response.json()

    if (!data || !data.nodeByUri) {
      throw error(404, {
        message: 'Page not found',
      })
    }

    let editorBlocks: EditorBlock[] = data.nodeByUri.editorBlocks 
      ? flatListToHierarchical(data.nodeByUri.editorBlocks) 
      : []

    return {
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
