<script lang="ts">
	let isUsingTouch = false

	import { page } from '$app/stores'
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import type { AcfHomePageSection } from '$lib/graphql/generated'
	export let block: AcfHomePageSection
	const images = block.homePageSection?.images?.nodes ?? []
	const link = `/${$page.params.lang}${block.homePageSection?.link?.nodes?.[0]?.uri ?? ''}`
	const content = block.innerBlocks ?? [] // Provide a default empty array
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import Image from '$components/Image.svelte'
	let currentIndex = 0
	let previousIndex = 0
	const totalImages = images.length
	let showImages = false
	let containerRef: HTMLDivElement // Add this for direct reference
	let isInitialized = false // Add this flag

	const duplicatedImages = [...images, ...images]

	const transformImageObject = (image: (typeof images)[number]) => {
		return {
			altText: image.altText,
			mediaDetails: {
				sizes: image.mediaDetails?.sizes ?? []
			}
		}
	}
	type Transform = {
		scale: number
		translateX: number
		translateY: number
	}

	let headerHeight: number

	function updateIndex() {
		// Only proceed if images are showing
		if (!showImages) return

		currentIndex = (currentIndex + 1) % totalImages

		const nextImage = document.getElementById(`image-${currentIndex}`)

		if (nextImage && containerRef) {
			containerRef.scrollTo({
				top: nextImage.offsetTop,
				behavior: 'smooth'
			})
		}

		if (currentIndex === 0 && containerRef) {
			containerRef.scrollTop = 0
		}

		setTimeout(updateIndex, 5000)
	}

	// Watch for showImages changes
	$: if (showImages && !isInitialized) {
		isInitialized = true
		// Start the animation after a small delay to ensure DOM is ready
		setTimeout(() => {
			setTimeout(updateIndex, 3000)
		}, 100)
	}

	const toggleImages = () => {
		if (isUsingTouch) return
		if (images.length === 0) return
		showImages = !showImages
		if (!showImages) {
			isInitialized = false
			currentIndex = 0
		}
	}

	onMount(() => {
		const header = document.getElementById('top-bar')
		if (header) {
			headerHeight = header.clientHeight
		}

		// Add touch start listener to detect actual touch usage
		document.addEventListener(
			'touchstart',
			() => {
				isUsingTouch = true
			},
			{ once: true }
		)

		// Re-enable hover if mouse is used after touch
		document.addEventListener(
			'mousemove',
			() => {
				isUsingTouch = false
			},
			{ once: true }
		)
	})
</script>

{#if content}
	<div on:mouseenter={toggleImages} on:mouseleave={toggleImages} aria-hidden="true" class="group h-full {(images.length === 0) ? 'py-6 md:py-12' : ''}">
		<a href={link} class="block hover:scale-105 transition-all duration-300">
			{#each content as block}
				{#if block}
					<BlockRenderer {block} />
				{/if}
			{/each}
		</a>
	</div>
{/if}

{#if showImages}
	<div
		class="w-[50vw] bg-white-off fixed h-screen left-[50vw] overflow-hidden z-10"
		style="top:{headerHeight}px"
		transition:fade={{ duration: 300 }}
	>
		<div bind:this={containerRef} class="images-container absolute w-full overflow-y-auto h-full">
			{#each duplicatedImages as image, i}
				<div id="image-{i % totalImages}" class="w-full">
					<Image
						imageObject={transformImageObject(image)}
						lazy={false}
						imageSize="medium"
						fit="contain"
					/>
				</div>
			{/each}
		</div>
	</div>
{/if}

<style>
	.images-container {
		scroll-behavior: smooth;
	}
</style>
