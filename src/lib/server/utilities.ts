import { WORDPRESS_URL, CDN_URL } from '$env/static/private'
import type { EditorBlock } from '$lib/types/wp-types'

export interface HierarchicalOptions {
	idKey?: string
	parentKey?: string
	childrenKey?: string
}

interface PageData {
	nodeByUri?: { title?: string }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic key access required for generic hierarchy builder
type HierarchicalItem = Record<string, any>

export function flatListToHierarchical(
	data: HierarchicalItem[] = [],
	{
		idKey = 'clientId',
		parentKey = 'parentClientId',
		childrenKey = 'children'
	}: HierarchicalOptions = {},
	pageData?: PageData
): EditorBlock[] {
	const tree: HierarchicalItem[] = []
	const childrenOf: Record<string, HierarchicalItem[]> = {}

	data.forEach((item) => {
		const newItem = { ...item }
		const parentId: string = newItem[parentKey] == null ? '0' : newItem[parentKey]

		childrenOf[newItem[idKey]] = childrenOf[newItem[idKey]] || []
		newItem[childrenKey] = childrenOf[newItem[idKey]]

		if (parentId !== '0') {
			childrenOf[parentId] = childrenOf[parentId] || []
			childrenOf[parentId].push(newItem)
		} else {
			tree.push(newItem)
		}
	})

	return tree
		.map(block => normalizeEditorBlock(block as EditorBlock, pageData))
		.filter((block): block is EditorBlock => block !== null)
}

/**
 * Normalize a URL by removing the WordPress base URL prefix
 * Returns a relative path if the URL matches the WordPress URL
 */
export function normalizeUrl(url: string): string {
	const wordpressUrl = WORDPRESS_URL || ''
	if (!wordpressUrl) return url

	// Generate variations of the WordPress URL
	const wordpressUrls = [
		wordpressUrl,
		wordpressUrl.replace('http://', 'https://'),
		wordpressUrl.replace('https://', 'http://'),
		wordpressUrl.replace(/\/$/, ''),
		wordpressUrl + '/',
	]

	const uniqueUrls = [...new Set(wordpressUrls)]

	for (const wpUrl of uniqueUrls) {
		if (url.startsWith(wpUrl)) {
			return url.replace(wpUrl, '')
		}
	}

	return url
}

/**
 * Normalize asset URLs by replacing WordPress URLs with CDN URLs
 * Only applies if CDN_URL environment variable is set
 */
export function normalizeAssetUrl(url: string): string {
	const cdnUrl = CDN_URL
	if (!cdnUrl) return url // No CDN configured, return original URL

	const assetExtensions = [
		// Images
		'gif', 'jpg', 'jpeg', 'png', 'webp', 'svg', 'bmp', 'tiff', 'tif', 'ico', 'avif', 'heic', 'heif',
		// Videos
		'mp4', 'm4v', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'webm', '3gp', 'ogv',
		// Audio
		'mp3', 'wav', 'ogg', 'flac', 'm4a', 'wma', 'aif', 'aiff',
		// Documents
		'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'
	]

	const hasAssetExtension = assetExtensions.some(ext =>
		url.toLowerCase().endsWith(`.${ext}`)
	)

	if (!hasAssetExtension) return url

	const wordpressUrl = WORDPRESS_URL || ''
	if (!wordpressUrl) return url

	// Generate variations of the WordPress URL
	const wordpressUrls = [
		wordpressUrl,
		wordpressUrl.replace('http://', 'https://'),
		wordpressUrl.replace('https://', 'http://'),
		wordpressUrl.replace(/\/$/, ''),
		wordpressUrl + '/',
	]

	const uniqueUrls = [...new Set(wordpressUrls)]

	for (const wpUrl of uniqueUrls) {
		if (url.startsWith(wpUrl)) {
			return url.replace(wpUrl, cdnUrl)
		}
	}

	return url
}

const assetExtensionSet = new Set([
	'gif', 'jpg', 'jpeg', 'png', 'webp', 'svg', 'bmp', 'tiff', 'tif', 'ico', 'avif', 'heic', 'heif',
	'mp4', 'm4v', 'mov', 'avi', 'mkv', 'wmv', 'flv', 'webm', '3gp', 'ogv',
	'mp3', 'wav', 'ogg', 'flac', 'm4a', 'wma', 'aif', 'aiff',
	'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf'
])

function isAssetUrl(url: string): boolean {
	const ext = url.toLowerCase().split('.').pop()?.split('?')[0]
	return ext ? assetExtensionSet.has(ext) : false
}

/**
 * Normalize any URL from the backend:
 * - Asset URLs (images, videos, etc.) get CDN rewriting if configured, otherwise left as-is
 * - All other WordPress URLs get converted to relative paths
 */
function normalizeAnyUrl(url: string): string {
	if (isAssetUrl(url)) return normalizeAssetUrl(url)
	return normalizeUrl(url)
}

/**
 * Recursively normalize all URLs in an object
 * - Asset URLs get CDN rewriting
 * - WordPress backend URLs get converted to relative paths
 */
export function normalizeAssetUrlsInObject(obj: unknown): void {
	if (obj === null || obj === undefined) return

	if (Array.isArray(obj)) {
		obj.forEach(item => normalizeAssetUrlsInObject(item))
		return
	}

	if (typeof obj === 'object') {
		const record = obj as Record<string, unknown>
		Object.keys(record).forEach(key => {
			const val = record[key]
			if (typeof val === 'string' && val.match(/^https?:\/\//)) {
				record[key] = normalizeAnyUrl(val)
			} else {
				normalizeAssetUrlsInObject(val)
			}
		})
	}
}

/**
 * Normalize href attributes in HTML content
 */
function normalizeHtmlContent(htmlContent: string): string {
	if (typeof htmlContent !== 'string') return htmlContent

	return htmlContent.replace(/href=["']([^"']+)["']/g, (match, url) => {
		const normalizedUrl = normalizeAnyUrl(url)
		return `href="${normalizedUrl}"`
	})
}

export function normalizeEditorBlock(block: EditorBlock, pageData?: PageData): EditorBlock | null {
	// Block data from GraphQL is loosely structured — use record access for safe mutation
	const attrs = block.attributes ?? ({} as EditorBlock['attributes'])
	if (!block.attributes) block.attributes = attrs

	// Remove empty core/image blocks that have no meaningful content
	if (block.name === 'core/image') {
		const hasUrl = attrs?.url && String(attrs.url).trim() !== ''
		const hasMediaDetails = block.mediaDetails?.sizes?.length > 0
		const hasAltText = attrs?.alt && String(attrs.alt).trim() !== ''

		if (!hasUrl && !hasMediaDetails && !hasAltText) {
			return null
		}
	}

	// Handle core/post-title block by adding content from page title
	if (block.name === 'core/post-title' && pageData?.nodeByUri?.title && attrs) {
		attrs.content = pageData.nodeByUri.title
	}

	// Normalize URLs for core/link and core/button blocks
	if ((block.name === 'core/link' || block.name === 'core/button') && attrs?.url) {
		attrs.url = normalizeUrl(String(attrs.url))
	}

	// Normalize asset URLs in various block attributes
	if (attrs) {
		if (attrs.src) {
			attrs.src = normalizeAssetUrl(String(attrs.src))
		}

		if (attrs.style && typeof attrs.style === 'object') {
			const style = attrs.style as Record<string, unknown>
			if (typeof style.backgroundImage === 'string') {
				style.backgroundImage = style.backgroundImage.replace(
					/url\(['"]?([^'"]+)['"]?\)/g,
					(_match: string, url: string) => `url('${normalizeAssetUrl(url)}')`
				)
			}
		}

		const mediaDetails = attrs.mediaDetails as { sizes?: Array<Record<string, string>> } | undefined
		if (mediaDetails?.sizes) {
			mediaDetails.sizes.forEach((size) => {
				if (size.sourceUrl) {
					size.sourceUrl = normalizeAssetUrl(size.sourceUrl)
				}
			})
		}
	}

	// Check if 'core/more' block and add necessary attributes
	if (block.name === 'core/more' && attrs) {
		attrs.align = null
		attrs.verticalAlignment = null
		attrs.style = null
	}

	// Parse JSON 'style' attribute
	if (attrs && typeof attrs.style === 'string') {
		try {
			const parsed = JSON.parse(attrs.style.replace(/var:preset\|/g, ''))
			attrs.style = parsed

			if (parsed?.elements?.link?.color?.text) {
				const colorValue = String(parsed.elements.link.color.text).split('|')[1]
				attrs.textColor = colorValue
			}
		} catch (err) {
			console.error('Error parsing style attribute:', err)
			attrs.style = null
		}
	}

	// Parse JSON 'layout' attribute
	if (attrs && typeof attrs.layout === 'string') {
		try {
			attrs.layout = JSON.parse(attrs.layout)
		} catch (err) {
			console.error('Error parsing layout attribute:', err)
			attrs.layout = null
		}
	}

	// Normalize asset URLs in nested data structures
	normalizeAssetUrlsInObject(block)

	// Process HTML content in blocks (like core/paragraph with <a> tags)
	if (attrs?.content && typeof attrs.content === 'string') {
		attrs.content = normalizeHtmlContent(attrs.content)
	}

	// Normalize child blocks recursively
	if (block.children) {
		const moreIndex = block.children.findIndex((child) => child.name === 'core/more')
		if (moreIndex !== -1) {
			const beforeMore = block.children.slice(0, moreIndex)
			const afterMore = block.children.slice(moreIndex + 1)

			block.children = [
				...beforeMore,
				{
					name: 'custom/read-more-wrapper',
					children: afterMore
						.map((child) => normalizeEditorBlock(child, pageData))
						.filter((c): c is EditorBlock => c !== null)
				} as EditorBlock
			]
		} else {
			block.children = block.children
				.map((child) => normalizeEditorBlock(child, pageData))
				.filter((c): c is EditorBlock => c !== null)
		}
	}

	return block
}
