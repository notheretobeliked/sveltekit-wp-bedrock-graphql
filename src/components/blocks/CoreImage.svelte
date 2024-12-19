<script lang="ts">
	import type { CoreImage } from '$lib/graphql/generated'
	import Image from '$components/Image.svelte'
	export let block: CoreImage

	const imageObject = {
		altText: block.attributes?.alt ? block.attributes.alt : '',
		mediaDetails: {
			sizes: block.mediaDetails.sizes
		}
	}
</script>

<figure class="mb-4 w-full lg:w-3/4 mx-auto">
	<Image {imageObject} imageSize="large" fit="contain" />
    {#if block.attributes?.caption}
        <figcaption class="font-martina text-sm mt-2 text-center">{block.attributes.caption}</figcaption>
    {/if}
</figure>
