export interface Book {
	slug: string
	edition: string | null
	artistFilterTerm: string | null
	authorFilterTerm: string | null
	publisherFilterTerm: string | null
	titleFilterTerm: string | null
	exhibition: string | null
	notes: string | null
	numperOfPages: number | null
	place: string | null
	printer: string | null
	series: string | null
	size: string | null
	title: string | null
	year: number | null
	ref: string | null
	publisher: string | null
	author: string | null
	coverDesign: string | null
	coverIllustration: string | null
	pageDesign: string | null
	pageCalligraphy: string | null
	pageIllustration: string | null
	translation: string | null
	coverCalligraphy: string | null
	collection: string | null
	thumbnailCoverImage: {
		sourceUrl: string
		height: number
		width: number
		mimeType: string
	} | null
	thumbnailImages: Array<{
		sourceUrl: string
		height: number
		width: number
		mimeType: string
	}>
}
