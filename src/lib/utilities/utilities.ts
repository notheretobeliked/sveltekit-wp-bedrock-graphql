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
	fontFamily: string,
	isArabic: boolean = false
) => {
	let sizeClasses: string = ''
	let fontClasses: string = ''
	let alignClasses: string = 'text-left'
	let colorClasses: string = ''

	// Handle font size with Arabic variants
	const prefix = isArabic ? 'ar-' : ''
	switch (fontSize) {
		case 'xs':
			sizeClasses = `text-${prefix}xs`
			break
		case 'sm':
			sizeClasses = `text-${prefix}sm`
			break
		case 'base':
			sizeClasses = `text-${prefix}base`
			break
		case 'lg':
			sizeClasses = `text-${prefix}base md:text-${prefix}lg`
			break
		case 'xl':
			sizeClasses = `text-${prefix}lg md:text-${prefix}xl`
			break
		case '2xl':
			sizeClasses = `text-${prefix}xl md:text-${prefix}2xl`
			break
		case '3xl':
			sizeClasses = `text-${prefix}2xl md:text-${prefix}3xl`
			break
		case '4xl':
			sizeClasses = `text-${prefix}2xl md:text-${prefix}4xl`
			break
		case '':
		default:
			sizeClasses = `text-${prefix}sm md:text-${prefix}base`
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
		case 'lyon':
			fontClasses = 'font-lyon'
			break
		case 'lyon-slanted':
			fontClasses = 'lyon-slanted'
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
