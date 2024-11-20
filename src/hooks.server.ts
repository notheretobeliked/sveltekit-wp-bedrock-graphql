import type { LibraryItemsQuery } from '$lib/graphql/generated'

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
  const lang = event.params.lang || 'en'

  // Fetch books if we haven't already for this language
  if (!state.books[lang]) {
    const response = await fetch(`${event.url.origin}/api/library-items`)
    const data = await response.json()
    state.books = data // Store all languages at once
  }

  // Attach the books for the current language to event.locals
  event.locals.books = state.books[lang]

  return await resolve(event)
}