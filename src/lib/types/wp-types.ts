import type { EditorBlock as GeneratedEditorBlock } from '$lib/graphql/generated'

/**
 * Common block attributes accessible on any block via GraphQL.
 * Specific block types (CoreParagraph, CoreGroup, etc.) have their own
 * typed attributes, but BlockRenderer needs generic access to common fields.
 */
export interface BlockAttributes {
	align?: string | null
	backgroundColor?: string | null
	textColor?: string | null
	className?: string | null
	fontSize?: string | null
	fontFamily?: string | null
	textAlign?: string | null
	content?: string | null
	verticalAlignment?: string | null
	style?: string | Record<string, unknown> | null
	layout?: string | Record<string, unknown> | null
	height?: string | null
	url?: string | null
	alt?: string | null
	src?: string | null
	ordered?: boolean | null
	level?: number | null
	width?: string | null
	isStackedOnMobile?: boolean | null
	citation?: string | null
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	[key: string]: any
}

/**
 * Extended EditorBlock type that includes:
 * - `children` added by flatListToHierarchical at runtime
 * - `attributes` as a generic record (specific blocks narrow this further)
 * - `mediaDetails` for image blocks
 */
export type EditorBlock = GeneratedEditorBlock & {
	children?: EditorBlock[]
	attributes?: BlockAttributes
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	mediaDetails?: any
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	resolvedPosts?: any[]
	/** Pagination metadata attached by +page.server.ts for CoreQuery blocks */
	paginationData?: {
		currentPage: number
		totalPages: number
		baseUri: string
		perPage: number
		totalPosts: number
	}
	/** Post context fields attached by CorePostTemplate per iteration */
	postTitle?: string
	postDate?: string
	postUri?: string
	postFeaturedImage?: Record<string, unknown>
}

/**
 * Menu item with `current` flag added by +layout.server.ts
 */
export interface MenuItem {
	label?: string | null
	order?: number | null
	uri?: string | null
	current?: boolean
}

/**
 * Image size data used by utilities (getSrcSet, findImageSizeData)
 * and the Image atom component.
 */
export type ImageSize = {
	name: string
	sourceUrl: string
	width: number
	height: number
}

/**
 * Image object from Yoast SEO data, used by OpenGraph and Twitter components.
 */
export type ImageObject = {
	altText?: string | null
	caption?: string | null
	mediaDetails?: {
		sizes?: Array<{
			name?: string | null
			sourceUrl?: string | null
			width?: string | null
			height?: string | null
		} | null> | null
	} | null
}
