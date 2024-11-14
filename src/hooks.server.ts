import type { LibraryItemsQuery } from '$lib/graphql/generated'
import { fetchAllLibraryItems } from '$lib/server/graphql'

// Type for our app's server state
type AppState = {
  books: {
    [lang: string]: LibraryItemsQuery['books']['nodes']
  }
}

// Initialize the state
const state: AppState = {
  books: {}
}

export const handle = async ({ event, resolve }) => {
  const lang = event.params.lang || 'en' // Default to English if no language specified

  // Fetch books if we haven't already for this language
  if (!state.books[lang]) {
    state.books[lang] = await fetchAllLibraryItems(lang)
  }

  // Attach the books to the event.locals
  event.locals.books = state.books[lang]

  return await resolve(event)
}