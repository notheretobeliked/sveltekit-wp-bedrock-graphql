<script lang="ts">
	import Image from '$components/Image.svelte'
	import ImageOverlay from './ImageOverlay.svelte'
	import type { ImageObject } from '$lib/types/wp-types'
	export let images: ImageObject[]

	const getFilename = (image: ImageObject): string => {
		const sourceUrl = image.mediaDetails.sizes[0].sourceUrl
		return sourceUrl.split('/').pop() || ''
	}

	// Sort images by filename
	images = images.sort((a, b) => getFilename(a).localeCompare(getFilename(b)))

	images = images.reverse()

	let selectedImageIndex: number | null = null

	function openOverlay(index: number) {
		selectedImageIndex = index
	}

	function closeOverlay() {
		selectedImageIndex = null
	}

	function navigateImage(direction: 'prev' | 'next') {
		if (selectedImageIndex !== null) {
			selectedImageIndex =
				(selectedImageIndex + (direction === 'next' ? 1 : -1) + images.length) % images.length
		}
	}
</script>

<div class="flex flex-row gap-4 min-w-max justify-end">
	{#each images as image, index}
		<figure class="h-[220px] cursor-pointer group">
			<button
				on:click={() => openOverlay(index)}
				on:keydown={(e) => e.key === 'Enter' && openOverlay(index)}
				class="cursor-pointer block relative w-full h-full"
			>
				<Image imageObject={image} imageSize="thumbnail" fit="contain" />
				<div
					class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-white-pure"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="1"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
						/>
					</svg>
				</div>
			</button>
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
