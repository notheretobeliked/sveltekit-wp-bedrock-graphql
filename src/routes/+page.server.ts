export const prerender = true

import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import {flatListToHierarchical} from '$lib/utilities/utilities'


export const load: PageServerLoad = async function load({ params, url }) {
  const uri = `/`

  try {
    const response = await graphqlQuery(PageContent, { uri: uri })
    checkResponse(response)
    const { data }: { data: any } = await response.json()

    if (data.page === null) {
      error(404, {
        message: 'Not found',
      })
    }

    let editorBlocks = data.page.editorBlocks ? flatListToHierarchical(data.page.editorBlocks) : []

    return {
      data: data,
      uri: uri,
      editorBlocks: editorBlocks,
    }
  } catch (err: unknown) {
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      error(httpError.status ?? 500, httpError.message);
    }
    error(500, err as string);
  }
}
