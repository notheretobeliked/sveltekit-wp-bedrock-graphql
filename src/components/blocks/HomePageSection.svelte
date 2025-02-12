<script lang="ts">
	let isUsingTouch = false
	import { onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import type { AcfHomePageSection } from '$lib/graphql/generated'
	export let block: AcfHomePageSection
	const images = block.homePageSection?.images?.nodes ?? []
	const link = block.homePageSection?.link?.url ?? ''
	const content = block.innerBlocks ?? [] // Provide a default empty array
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import Image from '$components/Image.svelte'
	const totalImages = images.length
	let showImages = false
	let containerRef: HTMLDivElement
	let isInitialized = false
	let isLoading = false
	let imagesLoaded = false
	import { language } from '$stores/language';
	const duplicatedImages = [...images, ...images]

	const transformImageObject = (image: any) => {
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
	let scrollInterval: ReturnType<typeof setInterval> | undefined
	let preloadedImages: HTMLImageElement[] = []
	let isInitialPositionSet = false

	function updateIndex() {
		if (!showImages) return

		if (containerRef) {
			if (scrollInterval) clearInterval(scrollInterval)
			
			const isRTL = $language === 'ar'
			const scrollStep = 5
			
			if (isRTL && !isInitialPositionSet) {
				containerRef.scrollLeft = containerRef.scrollWidth / 2
				isInitialPositionSet = true
			}
			
			scrollInterval = setInterval(() => {
				if (isRTL) {
					containerRef.scrollLeft -= scrollStep

					if (Math.abs(containerRef.scrollLeft) < 1) {
						void containerRef.offsetHeight
						containerRef.scrollLeft = containerRef.scrollWidth / 2
					}
				} else {
					containerRef.scrollLeft += scrollStep
					if (containerRef.scrollLeft >= containerRef.scrollWidth / 2) {
						containerRef.scrollLeft = 0
					}
				}
			}, 30)
		}
	}

	$: if (!showImages) {
		isInitialPositionSet = false
		if (scrollInterval) {
			clearInterval(scrollInterval)
			scrollInterval = undefined
		}
	}

	$: if (showImages && !isInitialized) {
		isInitialized = true
		requestAnimationFrame(updateIndex)
	}

	async function preloadImages() {
		isLoading = true
		const loadPromises = duplicatedImages.map(image => {
			return new Promise((resolve, reject) => {
				const largeSize = image.mediaDetails?.sizes?.find((size) => size?.name === 'large')
				if (largeSize?.sourceUrl) {
					const imgElement = new window.Image()
					imgElement.onload = () => resolve(imgElement)
					imgElement.onerror = reject
					imgElement.src = largeSize.sourceUrl
					preloadedImages.push(imgElement)
				} else {
					resolve(null)
				}
			})
		})

		try {
			await Promise.all(loadPromises)
			imagesLoaded = true
		} catch (error) {
			console.error('Failed to load some images:', error)
		} finally {
			isLoading = false
		}
	}

	const toggleImages = async () => {
		if (isUsingTouch) return
		if (images.length === 0) return
		
		if (!showImages) {
			showImages = true
			if (!imagesLoaded) {
				await preloadImages()
			}
			isInitialized = true
			requestAnimationFrame(updateIndex)
		} else {
			showImages = false
			isInitialized = false
			if (scrollInterval) {
				clearInterval(scrollInterval)
				scrollInterval = undefined
			}
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
		class="group biglink {images.length === 0 ? 'py-6 md:py-12' : ''}"
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
		class="w-[50vw] bg-white-off fixed h-screen left-[50vw] overflow-x-scroll z-10 top-[56px]"
		transition:fade={{ duration: 300 }}
	>
		{#if isLoading}
			<div class="flex items-center justify-center h-full">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
			</div>
		{:else}
			<div bind:this={containerRef} class="images-container absolute w-full overflow-x-auto h-full">
				<div class="flex flex-nowrap h-full">
					{#each duplicatedImages as image, i}
						<div
							id="image-{i % totalImages}"
							class="h-full flex-shrink-0 aspect-[{image.mediaDetails?.width ?? 1}/{image.mediaDetails?.height ?? 1}]"
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
		{/if}
	</div>
{/if}

<style lang='postcss'>
	.biglink {
		height: 100%;
	}
</style>