<script lang="ts">
	import type { CoreImage } from '$lib/graphql/generated'
	import Image from '$components/Image.svelte'
	export let block: CoreImage

	console.log(block)
	const imageObject = {
		altText: block.attributes?.alt ? block.attributes.alt : '',
		mediaDetails: {
			sizes: block.mediaDetails.sizes
		}
	}
</script>

<figure class="mb-4">
	<Image {imageObject} imageSize="large" fit="contain" />
    {#if block.attributes?.caption}
        <figcaption class="font-martina text-sm mt-2">{block.attributes.caption}</figcaption>
    {/if}
</figure>
