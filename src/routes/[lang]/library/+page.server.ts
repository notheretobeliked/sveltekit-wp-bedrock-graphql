import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

function getYearRangeFromFlat(books: any[]) {
  const years = books
    .map(book => book.year)
    .filter((year): year is number => 
      typeof year === 'number' && !isNaN(year)  // Make sure we only get valid numbers
    )
  
  if (years.length === 0) {
    return { minYear: null, maxYear: null }
  }

  return {
    minYear: Math.min(...years),
    maxYear: Math.max(...years)
  }
}

export const load: PageServerLoad = async function load({ params, fetch }) {
  try {
    const lang = params.lang || 'en'

    // Fetch books and taxonomies in parallel
    const [booksResponse, artistsResponse, authorsResponse, publishersResponse] = await Promise.all([
      fetch(`/api/library-items?lang=${lang}`),
      fetch(`/api/library-items?lang=${lang}&type=artists`),
      fetch(`/api/library-items?lang=${lang}&type=authors`),
      fetch(`/api/library-items?lang=${lang}&type=publishers`)
    ])

    if (!booksResponse.ok || !artistsResponse.ok || !authorsResponse.ok || !publishersResponse.ok) {
      throw new Error('One or more API requests failed')
    }

    const [books, artists, authors, publishers] = await Promise.all([
      booksResponse.json(),
      artistsResponse.json(),
      authorsResponse.json(),
      publishersResponse.json()
    ])

    return {
      books,
      uri: params.uri,
      artists,
      authors,
      publishers,
      language: lang,
      yearRange: getYearRangeFromFlat(books)
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw error(500, err.message)
    }
    throw error(500, 'An unknown error occurred')
  }
}