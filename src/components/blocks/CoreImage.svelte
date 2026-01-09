<script lang="ts">
	import type { CoreImage, MediaItem } from '$lib/graphql/generated'
	import Image from '$components/atoms/Image.svelte'

	interface Props {
		block: CoreImage
	}

	let { block }: Props = $props()

	let imageObject = $derived({
		altText: block.attributes?.alt ?? '',
		mediaDetails: {
			sizes: block.mediaDetails?.sizes ?? []
		},
		contentTypeName: 'attachment',
		databaseId: 0,
		id: '',
		isComment: false,
		isTermNode: false,
		slug: '',
		uri: ''
	} as MediaItem)

	let caption = $derived(block.attributes?.caption)
	let align = $derived(block.attributes?.align)

	let alignClass = $derived(
		align === 'wide'
			? 'alignwide'
			: align === 'full'
				? 'w-screen relative left-1/2 -translate-x-1/2'
				: align === 'center'
					? 'self-center'
					: align === 'left'
						? 'self-start'
						: align === 'right'
							? 'self-end'
							: ''
	)
</script>

<figure class="mb-4 w-full {alignClass}">
	<Image {imageObject} imageSize="large" fit="contain" />
	{#if caption}
		<figcaption class="font-sans text-sm mt-2 text-center">{caption}</figcaption>
	{/if}
</figure>
