import type { LibraryItemsQuery, LibraryItemsQueryVariables } from '$lib/graphql/generated'
import LibraryItems from '$lib/graphql/query/library.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const prerender = true

async function fetchAllLibraryItems(language: string) {
	let hasNextPage = true
	let after: string | null = null
	const allBooks: LibraryItemsQuery['books']['nodes'] = []

	while (hasNextPage) {
		const response = await graphqlQuery<LibraryItemsQuery, LibraryItemsQueryVariables>(
			LibraryItems,
			{ language, after }
		)

		checkResponse(response)
		const { data } = (await response.json()) as { data: LibraryItemsQuery }

		if (!data || !data.books) {
			throw error(404, { message: 'Books not found' })
		}

		allBooks.push(...data.books.nodes)

		// Update the pagination information
		hasNextPage = data.books.pageInfo.hasNextPage
		after = data.books.pageInfo.endCursor
	}

	return allBooks
}

function isPersonType(author: any): author is { name: string; slug: string; translations?: any[] } {
	return author && typeof author.name === 'string' && typeof author.slug === 'string'
}

type BookDataField =
	| 'personCoverCalligraphy'
	| 'personCoverDesign'
	| 'personCoverIllustration'
	| 'personPageDesign'
	| 'personPageIllustration'
	| 'personPageCalligraphy'

const restructureLibraryItems = (data: LibraryItemsQuery) => {
	return data.books?.nodes
		?.sort((a, b) => a.slug.localeCompare(b.slug))
		.map((book) => {
			const bookData = book.bookData
			if (!bookData) return null

			const firstImage = bookData.images?.nodes[0]

			// Create sets for unique artists, authors, and publishers
			const artists = new Set(
				[
					...(bookData.personCoverDesign?.nodes || []),
					...(bookData.personCoverIllustration?.nodes || []),
					...(bookData.personPageDesign?.nodes || []),
					...(bookData.personPageCalligraphy?.nodes || []),
					...(bookData.personPageIllustration?.nodes || []),
					...(bookData.personCoverCalligraphy?.nodes || [])
				].map((person) => ({ name: person.name, slug: person.slug }))
			)

			const authors = new Set(
				bookData.personAuthor?.nodes.map((author) => ({ name: author.name, slug: author.slug })) ||
					[]
			)
			const publishers = new Set(
				bookData.publisher?.nodes.map((publisher) => ({
					name: publisher.name,
					slug: publisher.slug
				})) || []
			)

			// Create filter terms
			const artistFilterTerm = Array.from(artists)
				.map((artist) => `${artist.name} ${artist.slug}`)
				.join(' ')
				.toLowerCase()
			const authorFilterTerm = Array.from(authors)
				.map((author) => `${author.name} ${author.slug}`)
				.join(' ')
				.toLowerCase()
			const publisherFilterTerm = Array.from(publishers)
				.map((publisher) => `${publisher.name} ${publisher.slug}`)
				.join(' ')
				.toLowerCase()

			return {
				slug: book.slug,
				edition: bookData.edition ?? null,
				exhibition: bookData.exhibition ?? null,
				notes: bookData.notes ?? null,
				numperOfPages: bookData.numperOfPages ?? null,
				place: bookData.place ?? null,
				printer: bookData.printer ?? null,
				series: bookData.series ?? null,
				size: bookData.size ?? null,
				title: bookData.title ?? null,
				year: bookData.year ?? null,
				ref: bookData.ref ?? null,
				publisher: bookData.publisher?.nodes.map((p) => p.name).join(', ') ?? null,
				author: bookData.personAuthor?.nodes.map((a) => a.name).join(', ') ?? null,
				coverDesign: bookData.personCoverDesign?.nodes.map((d) => d.name).join(', ') ?? null,
				coverIllustration:
					bookData.personCoverIllustration?.nodes.map((i) => i.name).join(', ') ?? null,
				pageDesign: bookData.personPageDesign?.nodes.map((d) => d.name).join(', ') ?? null,
				pageCalligraphy:
					bookData.personPageCalligraphy?.nodes.map((c) => c.name).join(', ') ?? null,
				pageIllustration:
					bookData.personPageIllustration?.nodes.map((i) => i.name).join(', ') ?? null,
				translation: bookData.personTranslation?.nodes.map((t) => t.name).join(', ') ?? null,
				coverCalligraphy:
					bookData.personCoverCalligraphy?.nodes.map((c) => c.name).join(', ') ?? null,
				collection: bookData.collection?.nodes.map((c) => c.name).join(', ') ?? null,
				thumbnailCoverImage: firstImage,
				thumbnailImages: bookData.images?.nodes,
				artistFilterTerm,
				authorFilterTerm,
				publisherFilterTerm,
				titleFilterTerm: bookData.title?.toLowerCase() ?? null
			}
		})
		.filter((book): book is NonNullable<typeof book> => book !== null)
}

function extractAuthors(data: LibraryItemsQuery) {
	const authorsMap = new Map<string, { name: string; slug: string }>()

	data.books?.nodes.forEach((book) => {
		const bookData = book.bookData
		if (bookData) {
			bookData.personAuthor?.nodes.forEach((author) => {
				if (isPersonType(author)) {
					authorsMap.set(author.slug, { name: author.name, slug: author.slug })
				}
			})
		}
	})

	const authors = Array.from(authorsMap.values())
	return authors
}

function extractArtists(data: LibraryItemsQuery) {
	const artistsMap = new Map<string, { name: string; slug: string }>()

	data.books?.nodes.forEach((book) => {
		const bookData = book.bookData
		if (bookData) {
			const fields: BookDataField[] = [
				'personCoverCalligraphy',
				'personCoverDesign',
				'personCoverIllustration',
				'personPageDesign',
				'personPageIllustration',
				'personPageCalligraphy'
			]
			fields.forEach((field) => {
				const nodes = bookData[field]?.nodes
				if (nodes && Array.isArray(nodes)) {
					nodes.forEach((person) => {
						if (isPersonType(person)) {
							artistsMap.set(person.slug, { name: person.name, slug: person.slug })
						}
					})
				}
			})
		}
	})

	const artists = Array.from(artistsMap.values())
	return artists
}

function extractPublishers(data: LibraryItemsQuery) {
	const publishersMap = new Map<string, { name: string; slug: string }>()

	data.books?.nodes.forEach((book) => {
		const bookData = book.bookData
		if (bookData) {
			bookData.publisher?.nodes.forEach((publisher) => {
				if (publisher.name && publisher.slug) {
					// Use the slug as a unique key
					publishersMap.set(publisher.slug, { name: publisher.name, slug: publisher.slug })
				}
			})
		}
	})

	// Convert the map values to an array
	return Array.from(publishersMap.values())
}

export const load: PageServerLoad = async function load({ params, url }) {
	const uri = params.uri

	try {
		const books = await fetchAllLibraryItems(params.lang)

		// Now restructure the data just as before
		const restructuredData = restructureLibraryItems({ books: { nodes: books } })

		return {
			books: restructuredData,
			uri,
			artists: extractArtists({ books: { nodes: books } }),
			publishers: extractPublishers({ books: { nodes: books } }),
			authors: extractAuthors({ books: { nodes: books } }),
			language: params.lang
		}
	} catch (err: unknown) {
		if (err instanceof Error) {
			throw error(500, err.message)
		}
		throw error(500, 'An unknown error occurred')
	}
}
