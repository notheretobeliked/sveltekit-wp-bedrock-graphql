<script lang="ts">
	import { onMount } from 'svelte'
	import { slide, fade } from 'svelte/transition'
	import type { AcfHomePageSection } from '$lib/graphql/generated'
	export let block: AcfHomePageSection
	const images = block.homePageSection?.images?.nodes ?? []
	const link = block.homePageSection?.link?.nodes[0].uri ?? []
	const content = block.innerBlocks ?? [] // Provide a default empty array
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import Image from '$components/Image.svelte'
	let currentIndex = 0
	let previousIndex = 0
	const totalImages = images.length
	let showImages = false
	console.log(block)

	const toggleImages = () => {
		showImages = !showImages
	}

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

	onMount(() => {
		const header = document.getElementById('top-bar')
		if (header) {
			headerHeight = header.clientHeight
		}
	})

	// Function to update the current index in a loop
	function updateIndex() {
		previousIndex = currentIndex
		currentIndex = (currentIndex + 1) % totalImages
		setTimeout(updateIndex, 2000) // Change image every 3 seconds
	}

	$: updateIndex()
	$: generateRandomTransforms()

	let transforms: Transform[] = []

	function generateRandomTransforms() {
		transforms = images.map(() => {
			const scale = 1 + Math.random() * 0.2 // Random scale between 1 and 1.2
			const translateX = (Math.random() - 0.5) * 10 // Random translateX between -5% and 5%
			const translateY = (Math.random() - 0.5) * 10 // Random translateY between -5% and 5%
			return { scale, translateX, translateY }
		})
	}
</script>

{#if content}
	<div on:mouseenter={toggleImages} on:mouseleave={toggleImages} aria-hidden="true" class="h-full">
		<a href="{link}">
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
		class="w-[50vw] fixed h-screen right-0 overflow-hidden z-10"
		style="top:{headerHeight}px"
		transition:fade={{ duration: 300 }}
	>
		{#each images as image, index}
			{#if index === currentIndex || index === previousIndex}
				<div class="w-full h-full absolute" transition:fade={{ duration: 1000 }}>
					<div
						class="ken-burns"
						style="--scale: {transforms[index].scale}; --translateX: {transforms[index]
							.translateX}%; --translateY: {transforms[index].translateY}%;"
					>
						<Image
							imageObject={transformImageObject(image)}
							lazy={false}
							imageSize="medium"
							fit="cover"
						/>
					</div>
				</div>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.ken-burns {
		width: 100%;
		height: 100%;
		overflow: hidden;
		animation: kenBurns 10s ease-in-out infinite;
	}

	@keyframes kenBurns {
		0% {
			transform: scale(var(--scale)) translate(var(--translateX), var(--translateY));
		}
		50% {
			transform: scale(calc(var(--scale) + 0.1))
				translate(calc(var(--translateX) - 5%), calc(var(--translateY) - 5%));
		}
		100% {
			transform: scale(var(--scale)) translate(var(--translateX), var(--translateY));
		}
	}
</style>
