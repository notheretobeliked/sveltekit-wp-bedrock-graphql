<script lang="ts">
	import Image from '$components/Image.svelte';
	import ImageOverlay from './ImageOverlay.svelte';
	import type { ImageObject } from '$lib/types/wp-types';
	export let images: ImageObject[];

	let selectedImageIndex: number | null = null;

	function openOverlay(index: number) {
		selectedImageIndex = index;
	}

	function closeOverlay() {
		selectedImageIndex = null;
	}

	function navigateImage(direction: 'prev' | 'next') {
		if (selectedImageIndex !== null) {
			selectedImageIndex = (selectedImageIndex + (direction === 'next' ? 1 : -1) + images.length) % images.length;
		}
	}
</script>

<div class="flex flex-row gap-4 min-w-max justify-end">
	{#each images as image, index}
		<figure class="h-[160px] cursor-pointer" on:click={() => openOverlay(index)}>
			<Image imageObject={image} imageSize="thumbnail" fit="contain" />
		</figure>
	{/each}
</div>

{#if selectedImageIndex !== null}
	<ImageOverlay 
		image={images[selectedImageIndex]} 
		on:close={closeOverlay}
		on:navigate={({ detail }) => navigateImage(detail)}
		{images}
		currentIndex={selectedImageIndex}
	/>
{/if}