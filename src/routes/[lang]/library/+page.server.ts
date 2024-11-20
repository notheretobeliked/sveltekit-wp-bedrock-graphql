import { error } from '@sveltejs/kit'
import { restructureLibraryItems, extractArtists, extractPublishers, extractAuthors, getYearRange } from '$lib/server/utilities'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async function load({ params, locals }) {
  try {
    const books = locals.books
    
    // Now restructure the data just as before
    const restructuredData = restructureLibraryItems({ books: { nodes: books } })
    const yearRange = getYearRange({ books: { nodes: books } })

    return {
      books: restructuredData,
      uri: params.uri,
      artists: extractArtists({ books: { nodes: books } }),
      publishers: extractPublishers({ books: { nodes: books } }),
      authors: extractAuthors({ books: { nodes: books } }),
      language: params.lang,
      yearRange
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw error(500, err.message)
    }
    throw error(500, 'An unknown error occurred')
  }
}