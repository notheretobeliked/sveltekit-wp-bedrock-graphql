import { GRAPHQL_ENDPOINT } from '$env/static/private'
import type { LibraryItemsQuery, LibraryItemsQueryVariables } from '$lib/graphql/generated'
import LibraryItems from '$lib/graphql/query/library.graphql?raw'

import { error } from '@sveltejs/kit'

export function checkResponse(response: Response) {
  const { headers, ok } = response
  if (!ok) {
    error(502, 'Bad Gateway')
  }

  if (!headers.get('content-type')?.includes('application/json')) {
    error(502, 'Bad Gateway: expected JSON data from GraphQL backend')
  }
}

export async function graphqlQuery<TData = any, TVariables = any>(
  query: string,
  variables: TVariables
): Promise<Response> {
  return fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      query,
      variables
    }),
    cache: 'no-cache'
  })
}

export async function fetchAllLibraryItems(language: string) {
  let hasNextPage = true
  let after: string | null = null
  const allBooks = []

  while (hasNextPage) {
    const response = await graphqlQuery(LibraryItems, { language, after })
    checkResponse(response)
    const { data } = await response.json()

    if (!data?.books?.nodes) {
      throw error(404, { message: 'Books not found' })
    }

    allBooks.push(...data.books.nodes)
    hasNextPage = data.books.pageInfo.hasNextPage
    after = data.books.pageInfo.endCursor
  }

  return allBooks
}