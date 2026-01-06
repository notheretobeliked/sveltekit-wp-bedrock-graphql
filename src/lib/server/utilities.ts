export interface HierarchicalOptions {
	idKey?: string
	parentKey?: string
	childrenKey?: string
}

export function flatListToHierarchical<T extends Record<string, any>>(
	data: T[] = [],
	{
		idKey = 'clientId',
		parentKey = 'parentClientId',
		childrenKey = 'children'
	}: HierarchicalOptions = {},
	pageData?: any
): T[] {
	const tree: T[] = []
	const childrenOf: Record<string, T[]> = {}

	data.forEach((item) => {
		const newItem: T = { ...item }
		const parentId: string = (newItem as any)[parentKey] == null ? '0' : (newItem as any)[parentKey]

		childrenOf[(newItem as any)[idKey]] = childrenOf[(newItem as any)[idKey]] || []
		;(newItem as any)[childrenKey] = childrenOf[(newItem as any)[idKey]]

		if (parentId !== '0') {
			childrenOf[parentId] = childrenOf[parentId] || []
			childrenOf[parentId].push(newItem)
		} else {
			tree.push(newItem)
		}
	})

	return tree.map(block => normalizeEditorBlock(block, pageData)).filter(block => block !== null)
}

/**
 * Normalize a URL by removing the WordPress base URL prefix
 * Returns a relative path if the URL matches the WordPress URL
 */
export function normalizeUrl(url: string): string {
	const wordpressUrl = process.env.WORDPRESS_URL || ''
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
	const cdnUrl = process.env.CDN_URL
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

	const wordpressUrl = process.env.WORDPRESS_URL || ''
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

/**
 * Recursively normalize all URLs in an object that look like asset URLs
 */
export function normalizeAssetUrlsInObject(obj: any): void {
	if (obj === null || obj === undefined) return

	if (Array.isArray(obj)) {
		obj.forEach(item => normalizeAssetUrlsInObject(item))
		return
	}

	if (typeof obj === 'object') {
		Object.keys(obj).forEach(key => {
			if (typeof obj[key] === 'string' && obj[key].match(/^https?:\/\//)) {
				obj[key] = normalizeAssetUrl(obj[key])
			} else {
				normalizeAssetUrlsInObject(obj[key])
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
		const normalizedUrl = normalizeAssetUrl(url)
		return `href="${normalizedUrl}"`
	})
}

export function normalizeEditorBlock(block: any, pageData?: any) {
	// Ensure attributes exists before attempting to access it
	if (!block.attributes) {
		block.attributes = {}
	}

	// Remove empty core/image blocks that have no meaningful content
	if (block.name === 'core/image') {
		const hasUrl = block.attributes?.url && block.attributes.url.trim() !== ''
		const hasMediaDetails = block.mediaDetails && block.mediaDetails.sizes && block.mediaDetails.sizes.length > 0
		const hasAltText = block.attributes?.alt && block.attributes.alt.trim() !== ''

		if (!hasUrl && !hasMediaDetails && !hasAltText) {
			return null // Will be filtered out by parent
		}
	}

	// Handle core/post-title block by adding content from page title
	if (block.name === 'core/post-title' && pageData?.nodeByUri?.title) {
		block.attributes.content = pageData.nodeByUri.title
	}

	// Normalize URLs for core/link and core/button blocks
	if ((block.name === 'core/link' || block.name === 'core/button') && block.attributes.url) {
		block.attributes.url = normalizeUrl(block.attributes.url)
	}

	// Normalize asset URLs in various block attributes
	if (block.attributes) {
		if (block.attributes.src) {
			block.attributes.src = normalizeAssetUrl(block.attributes.src)
		}

		if (block.attributes.style && typeof block.attributes.style === 'object' && block.attributes.style.backgroundImage) {
			block.attributes.style.backgroundImage = block.attributes.style.backgroundImage.replace(
				/url\(['"]?([^'"]+)['"]?\)/g,
				(match: string, url: string) => `url('${normalizeAssetUrl(url)}')`
			)
		}

		if (block.attributes.mediaDetails && block.attributes.mediaDetails.sizes) {
			block.attributes.mediaDetails.sizes.forEach((size: any) => {
				if (size.sourceUrl) {
					size.sourceUrl = normalizeAssetUrl(size.sourceUrl)
				}
			})
		}
	}

	// Check if 'core/more' block and add necessary attributes
	if (block.name === 'core/more') {
		block.attributes = {
			...block.attributes,
			align: null,
			verticalAlignment: null,
			style: null
		}
	}

	// Check if 'style' attribute exists and is a string
	if (typeof block.attributes.style === 'string') {
		try {
			block.attributes.style = JSON.parse(block.attributes.style.replace(/var:preset\|/g, ''))

			if (
				block.attributes.style.elements &&
				block.attributes.style.elements.link &&
				block.attributes.style.elements.link.color &&
				block.attributes.style.elements.link.color.text
			) {
				const colorValue = block.attributes.style.elements.link.color.text.split('|')[1]
				block.attributes.textColor = colorValue
			}
		} catch (error) {
			console.error('Error parsing style attribute:', error)
			block.attributes.style = null
		}
	}

	if (typeof block.attributes.layout === 'string') {
		try {
			block.attributes.layout = JSON.parse(block.attributes.layout)
		} catch (error) {
			console.error('Error parsing layout attribute:', error)
			block.attributes.layout = null
		}
	}

	// Normalize asset URLs in nested data structures
	normalizeAssetUrlsInObject(block)

	// Process HTML content in blocks (like core/paragraph with <a> tags)
	if (block.attributes && block.attributes.content) {
		block.attributes.content = normalizeHtmlContent(block.attributes.content)
	}

	// Normalize child blocks recursively
	if (block.children) {
		const moreIndex = block.children.findIndex((child: any) => child.name === 'core/more')
		if (moreIndex !== -1) {
			const beforeMore = block.children.slice(0, moreIndex)
			const afterMore = block.children.slice(moreIndex + 1)

			block.children = [
				...beforeMore,
				{
					name: 'custom/read-more-wrapper',
					children: afterMore.map((child: any) => normalizeEditorBlock(child, pageData)).filter((child: any) => child !== null)
				}
			]
		} else {
			block.children = block.children.map((child: any) => normalizeEditorBlock(child, pageData)).filter((child: any) => child !== null)
		}
	}

	return block
}
