import type { ImageSize } from '$lib/types/wp-types'

export const findImageSizeData = (
	property: keyof ImageSize,
	sizes: ImageSize[],
	name: string
): string => {
	const size = sizes.find((size) => size.name === name)
	if (size && property in size) {
		return String(size[property])
	}
	return ''
}

export const getSrcSet = (sizes: ImageSize[]): string => {
	return sizes.map(({ sourceUrl, width }) => `${sourceUrl} ${width}w`).join(', ')
}

export const classNames = (
	fontSize: string,
	textColor: string,
	align: string,
	fontFamily: string
) => {
	let sizeClasses: string = ''
	let fontClasses: string = ''
	let alignClasses: string = 'text-left' // Initialize with default value
	let colorClasses: string = ''

	// Handle font size
	switch (fontSize) {
		case 'xs':
			sizeClasses = 'text-xs'
			break
		case 'sm':
			sizeClasses = 'text-sm'
			break
		case 'base':
			sizeClasses = 'text-base'
			break
		case 'lg':
			sizeClasses = 'text-base md:text-lg'
			break
		case 'xl':
			sizeClasses = 'text-lg md:text-xl'
			break
		case '2xl':
			sizeClasses = 'text-xl md:text-2xl'
			break
		case '3xl':
			sizeClasses = 'text-2xl md:text-3xl'
			break
		case '4xl':
			sizeClasses = 'text-2xl md:text-4xl'
			break
		case '':
		default:
			sizeClasses = 'text-sm md:text-base'
			break
	}

	// Handle font family
	switch (fontFamily) {
		case 'martina':
			fontClasses = 'font-martina'
			break
		case 'manchette':
			fontClasses = 'font-manchette'
			break
		case 'boogy':
			fontClasses = 'font-boogy'
			break
		case '':
		default:
			fontClasses = 'font-martina'
			break
	}

	// Handle text alignment
	switch (align) {
		case 'center':
			alignClasses = 'text-center'
			break
		case 'right':
			alignClasses = 'text-right'
			break
		case '':
		case 'left':
		default:
			alignClasses = 'text-left'
			break
	}

	// Handle text color
	colorClasses = textColor ? `text-${textColor}` : ''
	if (textColor === 'green') {
		colorClasses += ' group-hover:text-black transition-color'
	}

	return `${sizeClasses} ${fontClasses} ${alignClasses} ${colorClasses}`.trim()
}
