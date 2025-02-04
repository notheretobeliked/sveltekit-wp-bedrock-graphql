import { json } from '@sveltejs/kit'
import libraryData from '$lib/data/library-data.json'
import taxonomiesData from '$lib/data/taxonomies.json'

export function GET({ url }) {
  try {
    const ref = url.searchParams.get('ref')
    const title = url.searchParams.get('title')
    const author = url.searchParams.get('author')
    const lang = url.searchParams.get('lang') || 'en' as keyof typeof libraryData
    const type = url.searchParams.get('type') // new parameter for taxonomy type

    // If type is specified, return taxonomy data
    if (type) {
      const taxonomies = taxonomiesData[lang] || {}
      switch (type) {
        case 'artists':
          return json(taxonomies.artists || [], {
            headers: {
              'cache-control': 'public, max-age=3600'
            }
          })
        case 'authors':
          return json(taxonomies.authors || [], {
            headers: {
              'cache-control': 'public, max-age=3600'
            }
          })
        case 'publishers':
          return json(taxonomies.publishers || [], {
            headers: {
              'cache-control': 'public, max-age=3600'
            }
          })
        default:
          return json({ error: 'Invalid taxonomy type' }, { status: 400 })
      }
    }

    // Original library items logic
    const langData = libraryData[lang] || []
    let filteredData = langData

    if (ref) {
      const item = filteredData.find(item => 
        item.ref?.toLowerCase() === ref.toLowerCase()
      )
      return json(item || null, {
        headers: {
          'cache-control': 'public, max-age=3600'
        }
      })
    }

    if (title) {
      filteredData = filteredData.filter(item =>
        item.title?.toLowerCase().includes(title.toLowerCase())
      )
    }

    if (author) {
      filteredData = filteredData.filter(item =>
        item.author?.toLowerCase().includes(author.toLowerCase())
      )
    }

    return json(filteredData, {
      headers: {
        'cache-control': 'public, max-age=3600'
      }
    })
  } catch (err) {
    console.error('Error in library-items API:', err)
    return json({ error: 'Internal Server Error' }, { status: 500 })
  }
}