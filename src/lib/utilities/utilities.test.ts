import { describe, it, expect } from 'vitest'
import { classNames, findImageSizeData, getSrcSet } from './utilities'
import type { ImageSize } from '$lib/types/wp-types'

describe('classNames', () => {
	it('returns empty string when all args are null/undefined', () => {
		expect(classNames(null, null, null, null)).toBe('')
		expect(classNames(undefined, undefined, undefined, undefined)).toBe('')
	})

	it('maps fontSize to responsive Tailwind classes', () => {
		expect(classNames('xs', null, null, null)).toBe('text-xs')
		expect(classNames('sm', null, null, null)).toBe('text-sm')
		expect(classNames('base', null, null, null)).toBe('text-base')
		expect(classNames('lg', null, null, null)).toBe('text-base md:text-lg')
		expect(classNames('xl', null, null, null)).toBe('text-lg md:text-xl')
		expect(classNames('2xl', null, null, null)).toBe('text-lg md:text-xl lg:text-2xl')
		expect(classNames('3xl', null, null, null)).toBe('text-xl md:text-2xl lg:text-3xl')
		expect(classNames('4xl', null, null, null)).toBe('text-2xl md:text-4xl')
	})

	it('ignores unknown fontSize values', () => {
		expect(classNames('unknown', null, null, null)).toBe('')
	})

	it('maps fontFamily to Tailwind class', () => {
		expect(classNames(null, null, null, 'sans')).toBe('font-sans')
	})

	it('ignores unknown fontFamily values', () => {
		expect(classNames(null, null, null, 'comic-sans')).toBe('')
	})

	it('maps text alignment (skips left as default)', () => {
		expect(classNames(null, null, 'left', null)).toBe('')
		expect(classNames(null, null, 'center', null)).toBe('text-center')
		expect(classNames(null, null, 'right', null)).toBe('text-right')
	})

	it('maps textColor to text-{color} class', () => {
		expect(classNames(null, 'white', null, null)).toBe('text-white')
		expect(classNames(null, 'primary', null, null)).toBe('text-primary')
	})

	it('combines multiple attributes', () => {
		const result = classNames('lg', 'white', 'center', 'sans')
		expect(result).toBe('text-base md:text-lg font-sans text-center text-white')
	})
})

describe('findImageSizeData', () => {
	const sizes: ImageSize[] = [
		{ name: 'thumbnail', sourceUrl: '/thumb.jpg', width: '150', height: '150', mimeType: 'image/jpeg' },
		{ name: 'medium', sourceUrl: '/medium.jpg', width: '300', height: '200', mimeType: 'image/jpeg' },
		{ name: 'large', sourceUrl: '/large.jpg', width: '1024', height: '768', mimeType: 'image/jpeg' }
	]

	it('returns the requested property for a matching size', () => {
		expect(findImageSizeData('sourceUrl', sizes, 'medium')).toBe('/medium.jpg')
		expect(findImageSizeData('width', sizes, 'large')).toBe('1024')
	})

	it('returns empty string when size not found', () => {
		expect(findImageSizeData('sourceUrl', sizes, 'full')).toBe('')
	})

	it('returns empty string for empty sizes array', () => {
		expect(findImageSizeData('sourceUrl', [], 'medium')).toBe('')
	})
})

describe('getSrcSet', () => {
	it('builds a srcset string from image sizes', () => {
		const sizes: ImageSize[] = [
			{ name: 'small', sourceUrl: '/small.jpg', width: '300', height: '200', mimeType: 'image/jpeg' },
			{ name: 'large', sourceUrl: '/large.jpg', width: '1024', height: '768', mimeType: 'image/jpeg' }
		]
		expect(getSrcSet(sizes)).toBe('/small.jpg 300w, /large.jpg 1024w')
	})

	it('returns empty string for empty array', () => {
		expect(getSrcSet([])).toBe('')
	})
})
