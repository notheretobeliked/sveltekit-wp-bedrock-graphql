<script lang="ts">
	let isUsingTouch = false
	import { browser } from '$app/environment'
	const isContinuous = browser
		? new URLSearchParams(window.location.search).has('continuous')
		: false

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

		if (isContinuous && containerRef) {
			// For continuous scroll, increment by 1 pixel every frame
			containerRef.scrollLeft += 3

			// Reset scroll position when reaching the end
			if (containerRef.scrollLeft >= containerRef.scrollWidth / 2) {
				containerRef.scrollLeft = 0
			}

			requestAnimationFrame(() => updateIndex())
		} else {
			// Original snapping behavior
			currentIndex = (currentIndex + 1) % totalImages

			const nextImage = document.getElementById(`image-${currentIndex}`)

			if (nextImage && containerRef) {
				containerRef.scrollTo({
					left: nextImage.offsetLeft,
					behavior: 'smooth'
				})
			}

			if (currentIndex === 0 && containerRef) {
				containerRef.scrollLeft = 0
			}

			setTimeout(updateIndex, 5000)
		}
	}

	// Watch for showImages changes
	$: if (showImages && !isInitialized) {
		isInitialized = true
		// Start the animation immediately for continuous mode, or after delay for normal mode
		if (isContinuous) {
			requestAnimationFrame(updateIndex)
		} else {
			setTimeout(() => {
				setTimeout(updateIndex, 3000)
			}, 100)
		}
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
	<div
		on:mouseenter={toggleImages}
		on:mouseleave={toggleImages}
		aria-hidden="true"
		class="group h-full {images.length === 0 ? 'py-6 md:py-12' : ''}"
	>
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
		class="w-[50vw] bg-white-off fixed h-screen left-[50vw] overflow-x-scroll z-10"
		style="top:{headerHeight}px"
		transition:fade={{ duration: 300 }}
	>
		<div bind:this={containerRef} class="images-container absolute w-full overflow-x-auto h-full">
			<div class="flex flex-nowrap h-full">
				{#each duplicatedImages as image, i}
					<div
						id="image-{i % totalImages}"
						class="h-full flex-shrink-0 aspect-[{image.mediaDetails?.width ?? 1}/{image.mediaDetails
							?.height ?? 1}]"
					>
						<Image
							imageObject={transformImageObject(image)}
							lazy={false}
							imageSize="large"
							fit="contain"
						/>
					</div>
				{/each}
			</div>
		</div>
	</div>
{/if}

<style>
	.images-container {
		scroll-behavior: smooth;
	}
</style>
