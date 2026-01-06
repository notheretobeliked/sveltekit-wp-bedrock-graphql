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

/**
 * Generates Tailwind classes only for explicitly set block attributes.
 * Returns empty strings for unset values, allowing global CSS to handle defaults.
 */
export const classNames = (
	fontSize: string | null | undefined,
	textColor: string | null | undefined,
	align: string | null | undefined,
	fontFamily: string | null | undefined
) => {
	const classes: string[] = []

	// Only add font size class if explicitly set
	if (fontSize) {
		switch (fontSize) {
			case 'xs':
				classes.push('text-xs')
				break
			case 'sm':
				classes.push('text-sm')
				break
			case 'base':
				classes.push('text-base')
				break
			case 'lg':
				classes.push('text-base md:text-lg')
				break
			case 'xl':
				classes.push('text-lg md:text-xl')
				break
			case '2xl':
				classes.push('text-lg md:text-xl lg:text-2xl')
				break
			case '3xl':
				classes.push('text-xl md:text-2xl lg:text-3xl')
				break
			case '4xl':
				classes.push('text-2xl md:text-4xl')
				break
		}
	}

	// Only add font family class if explicitly set
	if (fontFamily) {
		switch (fontFamily) {
			case 'inter':
				classes.push('font-sans')
				break
		}
	}

	// Only add alignment class if explicitly set (and not default 'left')
	if (align && align !== 'left') {
		switch (align) {
			case 'center':
				classes.push('text-center')
				break
			case 'right':
				classes.push('text-right')
				break
		}
	}

	// Only add color class if explicitly set
	if (textColor) {
		classes.push(`text-${textColor}`)
	}

	return classes.join(' ')
}
