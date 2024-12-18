export const prerender = true
import Posts from '$lib/graphql/query/posts.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const entries = () => {
	return [{ lang: 'en' }, { lang: 'ar' }]
}

export const load: PageServerLoad = async function load({ params, url }) {
	const uri = `/${params.all || ''}`

	// Restructure the books data

	try {
		const response = await graphqlQuery(Posts, { lang: params.lang })
		checkResponse(response)
		const { data } = await response.json()

		// Access the posts array through the correct path
		const posts = data.posts.nodes

		const flattenedData = posts.map((post) => {
			const date = new Date(post.date)
			const formattedDate = date
				.toLocaleDateString('en-GB', {
					day: '2-digit',
					month: '2-digit',
					year: 'numeric'
				})
				.replace(/\//g, '.')

			return {
				title: post.title,
				byline: post.learningHubFields.byline || '',
				slug: `/${params.lang}/learning-hub/${post.slug}`, // Modified this line to include language
				category: post.categories.nodes[0]?.name || 'Uncategorized',
				categorySlug: post.categories.nodes[0]?.slug || 'uncategorized',
				date: formattedDate
			}
		})

		const categories = Array.from(
			new Set(
				posts
					.map((post) => ({
						name: post.categories.nodes[0]?.name || 'Uncategorized',
						slug: post.categories.nodes[0]?.slug || 'uncategorized'
					}))
					.map(JSON.stringify)
			)
		).map(JSON.parse)

		return {
			posts: flattenedData,
			categories,
			uri
		}
	} catch (err: unknown) {
		console.error('Server Error:', err) // Add error logging
		const httpError = err as { status: number; message: string }
		if (httpError.message) {
			throw error(httpError.status ?? 500, httpError.message)
		}
		throw error(500, 'Internal Server Error')
	}
}
