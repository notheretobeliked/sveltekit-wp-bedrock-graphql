<script lang="ts">
	import type { CoreImage, MediaItem } from '$lib/graphql/generated'
	import Image from '$components/atoms/Image.svelte'
	interface Props {
		block: CoreImage;
	}

	let { block }: Props = $props();

	const imageObject = {
		altText: block.attributes?.alt ? block.attributes.alt : '',
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
	} as MediaItem
</script>

<figure class="mb-4 w-full lg:w-3/4 mx-auto">
	<Image {imageObject} imageSize="large" fit="contain" />
    {#if block.attributes?.caption}
        <figcaption class="font-inter text-sm mt-2 text-center">{block.attributes.caption}</figcaption>
    {/if}
</figure>
