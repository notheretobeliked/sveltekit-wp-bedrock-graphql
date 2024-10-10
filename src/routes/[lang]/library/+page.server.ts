import type { LibraryItemsQuery, LibraryItemsQueryVariables } from '$lib/graphql/generated';
import LibraryItems from '$lib/graphql/query/library.graphql?raw';
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const prerender = true;

export const load: PageServerLoad = async function load({ params, url }) {
  const uri = `/`;

  try {
    const response = await graphqlQuery<LibraryItemsQuery, LibraryItemsQueryVariables>(
      LibraryItems,
      { language: params.lang }
    );
    
    checkResponse(response);
    const { data } = await response.json() as { data: LibraryItemsQuery };

    if (data === null) {
      throw error(404, {
        message: 'Not found',
      });
    }

    return {
      data,
      uri,
      language: params.lang,
    };
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw error(500, err.message);
    }
    throw error(500, 'An unknown error occurred');
  }
};