import type { PageServerLoad } from './$types'
import PageContent from '$lib/graphql/query/page.graphql?raw'
import { checkResponse, graphqlQuery } from '$lib/utilities/graphql'
import { error } from '@sveltejs/kit'
import type { EditorBlock } from '$lib/types/wp-types'
import { flatListToHierarchical, restructureLibraryItems } from '$lib/server/utilities'

export const load = (async ({ params, url, locals, parent }) => {
    const parentData = await parent()
    const lang = params.lang
    let uri: string

    if (lang === 'en') {
        uri = '/'
    } else if (lang === 'ar') {
        const arTranslation = parentData.data.page.translations.find(
            t => t.languageCode === 'ar'
        )
        uri = arTranslation ? `/${arTranslation.slug}` : '/'
    } else {
        uri = '/'
    }

    const books = locals.books ?? []
    const restructuredData = books.length 
        ? restructureLibraryItems({ books: { nodes: books } })
        : []

    try {
        const response = await graphqlQuery(PageContent, { uri })
        checkResponse(response)
        const { data } = await response.json()

        if (!data || !data.nodeByUri) {
            throw error(404, { message: 'Page not found' })
        }

        const editorBlocks: EditorBlock[] = data.nodeByUri.editorBlocks 
            ? flatListToHierarchical(data.nodeByUri.editorBlocks) 
            : []

        return {
            books: restructuredData,
            data,
            uri,
            editorBlocks,
        }
    } catch (err: unknown) {
        console.error('Server Error:', err)
        const httpError = err as { status: number; message: string }
        if (httpError.message) {
            throw error(httpError.status ?? 500, httpError.message)
        }
        throw error(500, 'Internal Server Error')
    }
}) satisfies PageServerLoad