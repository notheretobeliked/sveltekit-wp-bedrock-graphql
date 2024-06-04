import { GRAPHQL_ENDPOINT } from '$env/static/private'
import type { PostsQueryVariables } from '$lib/generated/graphql'

import { error } from '@sveltejs/kit'

export function checkResponse(response: Response) {
  const { headers, ok } = response
  if (!ok) {
    error(502, 'Bad Gateway');
  }

  if (!headers.get('content-type')?.includes('application/json')) {
    error(502, 'Bad Gateway: expected JSON data from GraphQL backend');
  }
}

type QueryVariables = PostsQueryVariables

export async function graphqlQuery(query: string, variables: QueryVariables = {}) {
  return fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    cache: 'no-cache', // This tells the fetch to bypass the cache
  })
}
