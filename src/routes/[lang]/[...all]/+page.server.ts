// export const prerender = true
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
    
// Now restructure the data just as before
const restructuredData = restructureLibraryItems({ books: { nodes: books } })



  try {
    const response = await graphqlQuery(PageContent, { uri: uri })
    checkResponse(response)
    const { data }: { data } = await response.json()

    if (data.page === null) {
      error(404, {
        message: 'Not found',
      })
    }

    let editorBlocks: EditorBlock[] = data.page.editorBlocks ? flatListToHierarchical(data.page.editorBlocks) : []

    return {
      books: restructuredData,
      data: data,
      uri: uri,
      editorBlocks: editorBlocks,
    }
  } catch (err: unknown) {
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      throw error(httpError.status ?? 500, httpError.message)
    }
    throw error(500, err as string)
  }
}
