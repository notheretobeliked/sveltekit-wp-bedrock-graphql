export const prerender = true

import LibraryItems from '$lib/graphql/query/library.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import {flatListToHierarchical} from '$lib/utilities/utilities'


export const load: PageServerLoad = async function load({ params, url }) {
  const uri = `/`

  try {
    const response = await graphqlQuery(LibraryItems, { language: params.lang })
    checkResponse(response)
    const { data }: { data: any } = await response.json()

    if (data.page === null) {
      error(404, {
        message: 'Not found',
      })
    }

    return {
      data: data,
      uri: uri,
      language: params.lang,
    }
  } catch (err: unknown) {
    const httpError = err as { status: number; message: string }
    if (httpError.message) {
      error(httpError.status ?? 500, httpError.message);
    }
    error(500, err as string);
  }
}
