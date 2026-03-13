<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let className = $derived(block.attributes?.className ?? '')
	let aspectRatio = $derived(block.attributes?.aspectRatio ?? '')
	let isLink = $derived(block.attributes?.isLink ?? false)
	let postUri = $derived(block.postUri)
	let postFeaturedImage = $derived(block.postFeaturedImage)

	let sizes = $derived(
		(postFeaturedImage?.mediaDetails as Record<string, unknown>)?.sizes as Array<Record<string, string>> ?? []
	)
	let altText = $derived((postFeaturedImage?.altText as string) ?? '')

	let largestSize = $derived.by(() => {
		if (!sizes || sizes.length === 0) return null
		return sizes.reduce((largest, current) => {
			const currentWidth = parseInt(current?.width ?? '0')
			const largestWidth = parseInt(largest?.width ?? '0')
			return currentWidth > largestWidth ? current : largest
		})
	})

	let srcset = $derived.by(() => {
		if (!sizes || sizes.length === 0) return ''
		return sizes.map((size) => `${size?.sourceUrl} ${size?.width}w`).join(', ')
	})

	let src = $derived(largestSize?.sourceUrl ?? '')
</script>

{#if postFeaturedImage}
	<figure class="{className} relative">
		{#if isLink && postUri}
			<a href={postUri}>
				<img
					{src}
					{srcset}
					sizes="100vw"
					alt={altText}
					loading="lazy"
					style={aspectRatio ? `aspect-ratio: ${aspectRatio}; object-fit: cover;` : ''}
				/>
			</a>
		{:else}
			<img
				{src}
				{srcset}
				sizes="100vw"
				alt={altText}
				loading="lazy"
				style={aspectRatio ? `aspect-ratio: ${aspectRatio}; object-fit: cover;` : ''}
			/>
		{/if}
	</figure>
{/if}
