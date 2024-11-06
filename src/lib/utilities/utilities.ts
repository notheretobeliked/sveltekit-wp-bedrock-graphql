import type { ImageSize } from '$lib/types/wp-types'

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
	}: HierarchicalOptions = {}
): T[] {
	const tree: T[] = []
	const childrenOf: Record<string, T[]> = {}

	data.forEach((item) => {
		const newItem: T = { ...item }
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

	return tree.map(normalizeEditorBlock) // Normalize each root level block
}

export function normalizeEditorBlock(block: any) {
	// Ensure attributes exists before attempting to access it
	if (!block.attributes) {
		block.attributes = {} // Initialize with an empty object if it doesn't exist
	}

	if (block.name.startsWith('acf/')) {
		if ('alignment' in block.attributes) {
			// Prefer 'alignment' over 'align', but don't overwrite if 'align' already exists
			block.attributes.align = block.attributes.align || block.attributes.alignment
			// Remove the 'alignment' attribute to avoid confusion
			delete block.attributes.alignment
		}
	}

	// Check if 'style' attribute exists and is a string
	if (typeof block.attributes.style === 'string') {
		try {
			// Parse the 'style' string as JSON
			block.attributes.style = JSON.parse(block.attributes.style.replace(/var:preset\|/g, ''))

			// Check and transform the color within 'elements.link' after parsing
			if (
				block.attributes.style.elements &&
				block.attributes.style.elements.link &&
				block.attributes.style.elements.link.color &&
				block.attributes.style.elements.link.color.text
			) {
				// Extracting color value after '|'
				const colorValue = block.attributes.style.elements.link.color.text.split('|')[1]
				// Assigning the extracted color value to a new property
				block.attributes.textColor = colorValue
			}
		} catch (error) {
			console.error('Error parsing style attribute:', error)
			block.attributes.style = null // Example error handling
		}
	}

	if (typeof block.attributes.layout === 'string') {
		try {
			block.attributes.layout = JSON.parse(block.attributes.layout)
		} catch (error) {
			console.error('Error parsing layout attribute:', error)
			block.attributes.layout = null // Or handle the error as needed
		}
	}

	// Normalize child blocks recursively
	if (block.children) {
		block.children = block.children.map(normalizeEditorBlock)
	}

	return block
}

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
			sizeClasses = 'text-sm md:text-base'
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
