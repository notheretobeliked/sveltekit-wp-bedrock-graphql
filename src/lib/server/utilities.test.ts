import { describe, it, expect } from 'vitest'
import {
	flatListToHierarchical,
	normalizeUrl,
	normalizeAssetUrl,
	normalizeAssetUrlsInObject,
	normalizeEditorBlock
} from './utilities'
import type { EditorBlock } from '$lib/types/wp-types'

// The mock env sets WORDPRESS_URL = 'https://cms.example.com' and CDN_URL = 'https://cdn.example.com'

describe('normalizeUrl', () => {
	it('strips the WordPress URL prefix and returns a relative path', () => {
		expect(normalizeUrl('https://cms.example.com/sample-page')).toBe('/sample-page')
	})

	it('handles http/https mismatch', () => {
		expect(normalizeUrl('http://cms.example.com/sample-page')).toBe('/sample-page')
	})

	it('returns non-WordPress URLs unchanged', () => {
		expect(normalizeUrl('https://external.com/page')).toBe('https://external.com/page')
	})

	it('handles trailing slash variations', () => {
		expect(normalizeUrl('https://cms.example.com/')).toBe('/')
	})
})

describe('normalizeAssetUrl', () => {
	it('rewrites asset URLs to the CDN', () => {
		expect(normalizeAssetUrl('https://cms.example.com/wp-content/uploads/photo.jpg'))
			.toBe('https://cdn.example.com/wp-content/uploads/photo.jpg')
	})

	it('handles various asset extensions', () => {
		expect(normalizeAssetUrl('https://cms.example.com/file.pdf'))
			.toBe('https://cdn.example.com/file.pdf')
		expect(normalizeAssetUrl('https://cms.example.com/video.mp4'))
			.toBe('https://cdn.example.com/video.mp4')
		expect(normalizeAssetUrl('https://cms.example.com/image.webp'))
			.toBe('https://cdn.example.com/image.webp')
		expect(normalizeAssetUrl('https://cms.example.com/image.avif'))
			.toBe('https://cdn.example.com/image.avif')
	})

	it('does not rewrite non-asset URLs', () => {
		expect(normalizeAssetUrl('https://cms.example.com/page'))
			.toBe('https://cms.example.com/page')
	})

	it('does not rewrite external asset URLs', () => {
		expect(normalizeAssetUrl('https://other.com/photo.jpg'))
			.toBe('https://other.com/photo.jpg')
	})
})

describe('normalizeAssetUrlsInObject', () => {
	it('recursively rewrites asset URLs in objects', () => {
		const obj = {
			sourceUrl: 'https://cms.example.com/uploads/photo.jpg',
			nested: {
				url: 'https://cms.example.com/uploads/video.mp4'
			}
		}
		normalizeAssetUrlsInObject(obj)
		expect(obj.sourceUrl).toBe('https://cdn.example.com/uploads/photo.jpg')
		expect(obj.nested.url).toBe('https://cdn.example.com/uploads/video.mp4')
	})

	it('rewrites URLs in arrays', () => {
		const arr = [
			{ sourceUrl: 'https://cms.example.com/a.jpg' },
			{ sourceUrl: 'https://cms.example.com/b.png' }
		]
		normalizeAssetUrlsInObject(arr)
		expect(arr[0].sourceUrl).toBe('https://cdn.example.com/a.jpg')
		expect(arr[1].sourceUrl).toBe('https://cdn.example.com/b.png')
	})

	it('converts non-asset WordPress URLs to relative paths', () => {
		const obj = { href: 'https://cms.example.com/about' }
		normalizeAssetUrlsInObject(obj)
		expect(obj.href).toBe('/about')
	})

	it('handles null and undefined gracefully', () => {
		expect(() => normalizeAssetUrlsInObject(null)).not.toThrow()
		expect(() => normalizeAssetUrlsInObject(undefined)).not.toThrow()
	})
})

describe('flatListToHierarchical', () => {
	it('converts a flat list into a tree based on parentClientId', () => {
		const flat = [
			{ clientId: '1', parentClientId: null, name: 'core/group', type: 'CoreGroup', attributes: {} },
			{ clientId: '2', parentClientId: '1', name: 'core/paragraph', type: 'CoreParagraph', attributes: { content: 'Hello' } },
			{ clientId: '3', parentClientId: '1', name: 'core/paragraph', type: 'CoreParagraph', attributes: { content: 'World' } }
		]
		const tree = flatListToHierarchical(flat as unknown as Record<string, unknown>[])
		expect(tree).toHaveLength(1)
		expect(tree[0].children).toHaveLength(2)
		expect(tree[0].children![0].attributes?.content).toBe('Hello')
		expect(tree[0].children![1].attributes?.content).toBe('World')
	})

	it('returns empty array for empty input', () => {
		expect(flatListToHierarchical([])).toEqual([])
	})

	it('handles multiple root-level blocks', () => {
		const flat = [
			{ clientId: '1', parentClientId: null, name: 'core/paragraph', type: 'CoreParagraph', attributes: {} },
			{ clientId: '2', parentClientId: null, name: 'core/heading', type: 'CoreHeading', attributes: {} }
		]
		const tree = flatListToHierarchical(flat as unknown as Record<string, unknown>[])
		expect(tree).toHaveLength(2)
	})

	it('filters out empty core/image blocks', () => {
		const flat = [
			{ clientId: '1', parentClientId: null, name: 'core/image', type: 'CoreImage', attributes: {} }
		]
		const tree = flatListToHierarchical(flat as unknown as Record<string, unknown>[])
		expect(tree).toHaveLength(0)
	})

	it('keeps core/image blocks that have a url', () => {
		const flat = [
			{ clientId: '1', parentClientId: null, name: 'core/image', type: 'CoreImage', attributes: { url: 'https://cms.example.com/photo.jpg' } }
		]
		const tree = flatListToHierarchical(flat as unknown as Record<string, unknown>[])
		expect(tree).toHaveLength(1)
	})
})

describe('normalizeEditorBlock', () => {
	it('parses JSON style attribute', () => {
		const block = {
			name: 'core/group',
			attributes: { style: '{"spacing":{"padding":{"top":"spacing|50"}}}' }
		} as unknown as EditorBlock
		const result = normalizeEditorBlock(block)
		expect(result?.attributes?.style).toEqual({ spacing: { padding: { top: 'spacing|50' } } })
	})

	it('parses JSON layout attribute', () => {
		const block = {
			name: 'core/group',
			attributes: { layout: '{"type":"flex","justifyContent":"center"}' }
		} as unknown as EditorBlock
		const result = normalizeEditorBlock(block)
		expect(result?.attributes?.layout).toEqual({ type: 'flex', justifyContent: 'center' })
	})

	it('normalizes link/button URLs to relative paths', () => {
		const block = {
			name: 'core/button',
			attributes: { url: 'https://cms.example.com/about' }
		} as unknown as EditorBlock
		const result = normalizeEditorBlock(block)
		expect(result?.attributes?.url).toBe('/about')
	})

	it('rewrites asset src to CDN', () => {
		const block = {
			name: 'core/image',
			attributes: { src: 'https://cms.example.com/photo.jpg', url: 'https://cms.example.com/photo.jpg', alt: 'Photo' }
		} as unknown as EditorBlock
		const result = normalizeEditorBlock(block)
		expect(result?.attributes?.src).toBe('https://cdn.example.com/photo.jpg')
	})

	it('nulls align/verticalAlignment/style on core/more blocks', () => {
		const block = {
			name: 'core/more',
			attributes: { align: 'wide', verticalAlignment: 'center', style: '{}' }
		} as unknown as EditorBlock
		const result = normalizeEditorBlock(block)
		expect(result?.attributes?.align).toBeNull()
		expect(result?.attributes?.verticalAlignment).toBeNull()
		expect(result?.attributes?.style).toBeNull()
	})

	it('adds page title as content for core/post-title blocks', () => {
		const block = {
			name: 'core/post-title',
			attributes: {}
		} as unknown as EditorBlock
		const result = normalizeEditorBlock(block, { nodeByUri: { title: 'My Page' } })
		expect(result?.attributes?.content).toBe('My Page')
	})

	it('normalizes href values in HTML content', () => {
		const block = {
			name: 'core/paragraph',
			attributes: { content: '<a href="https://cms.example.com/about">About</a>' }
		} as unknown as EditorBlock
		const result = normalizeEditorBlock(block)
		expect(result?.attributes?.content).toBe('<a href="/about">About</a>')
	})

	it('recursively normalizes children', () => {
		const block = {
			name: 'core/group',
			attributes: {},
			children: [
				{
					name: 'core/button',
					attributes: { url: 'https://cms.example.com/contact' }
				} as unknown as EditorBlock
			]
		} as unknown as EditorBlock
		const result = normalizeEditorBlock(block)
		expect(result?.children?.[0].attributes?.url).toBe('/contact')
	})

	it('returns null for empty core/image blocks', () => {
		const block = {
			name: 'core/image',
			attributes: {}
		} as unknown as EditorBlock
		expect(normalizeEditorBlock(block)).toBeNull()
	})

	it('handles core/more by wrapping subsequent children in read-more-wrapper', () => {
		const block = {
			name: 'core/group',
			attributes: {},
			children: [
				{ name: 'core/paragraph', attributes: { content: 'Before' } } as unknown as EditorBlock,
				{ name: 'core/more', attributes: {} } as unknown as EditorBlock,
				{ name: 'core/paragraph', attributes: { content: 'After' } } as unknown as EditorBlock
			]
		} as unknown as EditorBlock
		const result = normalizeEditorBlock(block)
		expect(result?.children).toHaveLength(2)
		expect(result?.children?.[0].name).toBe('core/paragraph')
		expect(result?.children?.[1].name).toBe('custom/read-more-wrapper')
		expect(result?.children?.[1].children).toHaveLength(1)
	})
})
