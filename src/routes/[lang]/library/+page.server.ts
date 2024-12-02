import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

function extractArtistsFromFlat(books: any[]) {
  const artistsMap = new Map<string, { name: string; slug: string }>()
  books.forEach(book => {
    if (book.artists) {
      book.artists.forEach((artist: { name: string; slug: string }) => {
        artistsMap.set(artist.slug, artist)
      })
    }
  })
  return Array.from(artistsMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}

function extractAuthorsFromFlat(books: any[]) {
  const authorsMap = new Map<string, { name: string; slug: string }>()
  books.forEach(book => {
    if (book.authors) {
      book.authors.forEach((author: { name: string; slug: string }) => {
        authorsMap.set(author.slug, author)
      })
    }
  })
  return Array.from(authorsMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}

function extractPublishersFromFlat(books: any[]) {
  const publishersMap = new Map<string, { name: string; slug: string }>()
  books.forEach(book => {
    if (book.publishers) {
      book.publishers.forEach((publisher: { name: string; slug: string }) => {
        publishersMap.set(publisher.slug, publisher)
      })
    }
  })
  return Array.from(publishersMap.values()).sort((a, b) => a.name.localeCompare(b.name))
}

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
    const response = await fetch(`/api/library-items?lang=${params.lang || 'en'}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    const books = await response.json()

    return {
      books,
      uri: params.uri,
      artists: extractArtistsFromFlat(books),
      publishers: extractPublishersFromFlat(books),
      authors: extractAuthorsFromFlat(books),
      language: params.lang,
      yearRange: getYearRangeFromFlat(books)
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw error(500, err.message)
    }
    throw error(500, 'An unknown error occurred')
  }
}