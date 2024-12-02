import { writeFileSync, mkdirSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import 'dotenv/config'

import { getEnvVar } from '../src/lib/server/config'
import { LibraryItems } from '../src/lib/graphql/query/library-prefetch'

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

	return restructureLibraryItems({ books: { nodes: allBooks } })
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

async function fetchAndSaveLibraryData() {
	try {
		const languages = ['en', 'ar']
		const data: Record<string, any> = {}

		for (const lang of languages) {
			console.log(`Fetching data for language: ${lang}...`)
			data[lang] = await fetchAllLibraryItems(lang)
			console.log(`✅ Successfully fetched data for ${lang}`)
		}

		// Write to JSON file for prerendering and API use
		const dataDir = join(projectRoot, 'src/lib/data')
		mkdirSync(dataDir, { recursive: true })
		writeFileSync(join(dataDir, 'library-data.json'), JSON.stringify(data), 'utf-8')
		console.log('✅ Library data JSON generated successfully')
	} catch (error) {
		console.error('Failed to generate library data:', error)
		process.exit(1)
	}
}

fetchAndSaveLibraryData()
