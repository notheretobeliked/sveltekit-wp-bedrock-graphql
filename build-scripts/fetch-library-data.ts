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

  return allBooks
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

    const apiDir = join(projectRoot, 'src/routes/api/library-items')
    mkdirSync(apiDir, { recursive: true })
    
    const apiContent = `
export const prerender = true;

const data = ${JSON.stringify(data)};

export function GET() {
  return new Response(JSON.stringify(data), {
    headers: {
      'content-type': 'application/json',
      'cache-control': 'public, max-age=3600'
    }
  });
}
`
    writeFileSync(join(apiDir, '+server.ts'), apiContent, 'utf-8')
    console.log('✅ Library data API generated successfully')
  } catch (error) {
    console.error('Failed to generate library data:', error)
    process.exit(1)
  }
}

fetchAndSaveLibraryData()