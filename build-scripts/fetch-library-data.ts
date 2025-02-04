import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import 'dotenv/config'

import { getEnvVar } from '../src/lib/server/config'
import { LibraryItems } from '../src/lib/graphql/query/library-prefetch'

import { error } from '@sveltejs/kit'

interface Person {
	name: string,
	nameTranslated: string,
	slug: string
	description: string
}

interface Taxonomies {
	artists: Person[]
	authors: Person[]
	publishers: Person[]
}

export function checkResponse(response: Response) {
	const { headers, ok } = response
	if (!ok) {
		error(502, 'Bad Gateway')
	}

	if (!headers.get('content-type')?.includes('application/json')) {
		error(502, 'Bad Gateway: expected JSON data from GraphQL backend')
	}
}

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
				].map((person) => ({
					name: person.name,
					slug: person.slug
				}))
			)

			const authors = new Set(
				bookData.personAuthor?.nodes.map((author) => ({
					name: author.name,
					slug: author.slug
				})) || []
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
				artists: Array.from(artists),
				authors: Array.from(authors),
				publishers: Array.from(publishers),
				artistFilterTerm: Array.from(artists)
					.map((artist) => `${artist.name} ${artist.slug}`)
					.join(' ')
					.toLowerCase(),
				authorFilterTerm: Array.from(authors)
					.map((author) => `${author.name} ${author.slug}`)
					.join(' ')
					.toLowerCase(),
				publisherFilterTerm: Array.from(publishers)
					.map((publisher) => `${publisher.name} ${publisher.slug}`)
					.join(' ')
					.toLowerCase(),
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

async function graphqlQuery<TData = any, TVariables = any>(
	query: string,
	variables: TVariables
): Promise<Response> {
	return fetch(getEnvVar('GRAPHQL_ENDPOINT'), {
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

async function fetchAllLibraryItems(language: string) {
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

	return {
		books: restructureLibraryItems({ books: { nodes: allBooks } }),
		taxonomies: extractUniqueTaxonomies(allBooks)
	}
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

function extractUniqueTaxonomies(books: any[]): Taxonomies {
	const artistsMap = new Map<string, Person>()
	const authorsMap = new Map<string, Person>()
	const publishersMap = new Map<string, Person>()

	books.forEach((book) => {
		const bookData = book.bookData
		if (!bookData) return

		// Debug log for first artist
		if (bookData.personCoverDesign?.nodes?.[0]) {
			console.log('Sample artist data:', {
				name: bookData.personCoverDesign.nodes[0].name,
				translations: bookData.personCoverDesign.nodes[0].translations,
				raw: bookData.personCoverDesign.nodes[0]
			})
		}

		// Collect all artist-type persons
		;[
			...(bookData.personCoverDesign?.nodes || []),
			...(bookData.personCoverIllustration?.nodes || []),
			...(bookData.personPageDesign?.nodes || []),
			...(bookData.personPageCalligraphy?.nodes || []),
			...(bookData.personPageIllustration?.nodes || []),
			...(bookData.personCoverCalligraphy?.nodes || [])
		].forEach((person) => {
			artistsMap.set(person.slug, {
				name: person.name,
				nameTranslated: person.translations?.[0]?.name || null,  // Changed this line
				slug: person.slug,
				description: person.description || ''
			})
		})

		// Debug log for first author
		if (bookData.personAuthor?.nodes?.[0]) {
			console.log('Sample author data:', {
				name: bookData.personAuthor.nodes[0].name,
				translations: bookData.personAuthor.nodes[0].translations?.[0]?.name || null,  // Changed this line,
				raw: bookData.personAuthor.nodes[0]
			})
		}

		// Collect authors
		bookData.personAuthor?.nodes.forEach((author) => {
			authorsMap.set(author.slug, {
				name: author.name,
				nameTranslated: author.translations?.[0]?.name || null,  // Changed this line || '',
				slug: author.slug,
				description: author.description || ''
			})
		})

		// Collect publishers
		bookData.publisher?.nodes.forEach((publisher) => {
			publishersMap.set(publisher.slug, {
				name: publisher.name,
				nameTranslated: publisher.translations?.[0]?.name || null,  // Changed this line
				slug: publisher.slug,
				description: publisher.description || ''
			})
		})
	})

	return {
		artists: Array.from(artistsMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
		authors: Array.from(authorsMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
		publishers: Array.from(publishersMap.values()).sort((a, b) => a.name.localeCompare(b.name))
	}
}

async function fetchAndSaveLibraryData() {
	try {
		const languages = ['en', 'ar']
		const libraryData: Record<string, any> = {}
		const taxonomiesData: Record<string, Taxonomies> = {}

		for (const lang of languages) {
			console.log(`Fetching data for language: ${lang}...`)
			const { books, taxonomies } = await fetchAllLibraryItems(lang)
			libraryData[lang] = books
			taxonomiesData[lang] = taxonomies
			console.log(`✅ Successfully fetched data for ${lang}`)
		}

		// Write both JSON files
		const dataDir = join(projectRoot, 'src/lib/data')
		mkdirSync(dataDir, { recursive: true })

		writeFileSync(join(dataDir, 'library-data.json'), JSON.stringify(libraryData), 'utf-8')
		writeFileSync(join(dataDir, 'taxonomies.json'), JSON.stringify(taxonomiesData), 'utf-8')

		console.log('✅ Library data and taxonomies JSON generated successfully')
	} catch (error) {
		console.error('Failed to generate data:', error)
		process.exit(1)
	}
}

fetchAndSaveLibraryData()
