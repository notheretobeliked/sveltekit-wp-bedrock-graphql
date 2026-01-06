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
</script>

<figure class="mb-4 w-full">
	<Image {imageObject} imageSize="large" fit="contain" />
	{#if caption}
		<figcaption class="font-sans text-sm mt-2 text-center">{caption}</figcaption>
	{/if}
</figure>
