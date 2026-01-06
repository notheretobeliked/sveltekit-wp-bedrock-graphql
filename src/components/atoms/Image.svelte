<script lang="ts">
	import type { MediaItem, MediaSize } from '$lib/graphql/generated'
	import type { ImageSize } from '$lib/types/wp-types'
	import { findImageSizeData, getSrcSet } from '$lib/utilities/utilities'

	type ImageSizeName = 'thumbnail' | 'medium' | 'medium_large' | 'large' | 'x_large'

	interface Props {
		imageObject: MediaItem
		lazy?: boolean
		imageSize?: ImageSizeName
		fit?: 'cover' | 'contain' | 'fill' | 'none'
		extraClasses?: string
		shadow?: boolean
	}

	let {
		imageObject,
		lazy = true,
		imageSize = 'thumbnail',
		fit = 'none',
		extraClasses = '',
		shadow = false
	}: Props = $props()

	let sizes = $derived(
		imageObject?.mediaDetails?.sizes
			?.filter((size): size is MediaSize => size !== null && typeof size.name === 'string')
			.map((size) => ({
				sourceUrl: size.sourceUrl ?? '',
				width: parseInt(size.width ?? '0'),
				height: parseInt(size.height ?? '0'),
				name: size.name as ImageSize['name']
			})) ?? []
	)

	let src = $derived(findImageSizeData('sourceUrl', sizes, imageSize))
	let width = $derived(findImageSizeData('width', sizes, imageSize))
	let height = $derived(findImageSizeData('height', sizes, imageSize))
	let altText = $derived(imageObject?.altText ?? '')

	function determineSizes(sizeName: ImageSizeName): string {
		switch (sizeName) {
			case 'thumbnail':
				return '(max-width: 600px) 50vw, (max-width: 1200px) 50vw, 25vw'
			case 'medium':
				return '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
			case 'medium_large':
				return '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
			case 'large':
				return '(max-width: 1200px) 100vw, 50vw'
			default:
				return '100vw'
		}
	}

	let srcsetLabels = $derived(determineSizes(imageSize))
</script>
<div class="relative w-full h-full max-w-none flex justify-center">
  <img
    loading={lazy ? 'lazy' : 'eager'}
    class={`${fit === 'contain' ? 'w-auto' : 'w-full'} h-full object-${fit} ${shadow ? 'drop-shadow-lg' : ''} ${extraClasses}`}
    {src}
    alt={altText}
    {width}
    {height}
    srcset={getSrcSet(sizes)}
    sizes={srcsetLabels}
  />
  <img 
    src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    class="absolute inset-0 w-full h-full"
    alt=""
    {width}
    {height}
  />
</div>
