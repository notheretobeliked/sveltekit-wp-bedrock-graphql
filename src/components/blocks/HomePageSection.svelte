<script lang="ts">
	import { slide } from 'svelte/transition'
	import type { HomePageSection } from '$lib/graphql/generated'
	export let block: HomePageSection
	const images = block.homePageSection.images.nodes
	const content = block.innerBlocks
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import Image from '$components/Image.svelte'
	let currentIndex = 0
	let previousIndex = 0
	const totalImages = images.length

	// Function to update the current index in a loop
	function updateIndex() {
		previousIndex = currentIndex
		currentIndex = (currentIndex + 1) % totalImages
		setTimeout(updateIndex, 2000) // Change image every 3 seconds
	}

	$: updateIndex()
	$: generateRandomTransforms()

	let transforms = []

	function generateRandomTransforms() {
		transforms = images.map(() => {
			const scale = 1 + Math.random() * 0.2 // Random scale between 1 and 1.2
			const translateX = (Math.random() - 0.5) * 10 // Random translateX between -5% and 5%
			const translateY = (Math.random() - 0.5) * 10 // Random translateY between -5% and 5%
			return { scale, translateX, translateY }
		})
	}
</script>

{#each content as block}
	<BlockRenderer {block} />
{/each}

<div class="w-[50vw] fixed h-screen right-0 top-0 overflow-hidden">
	{#each images as image, index}
		{#if index === currentIndex || index === previousIndex}
			<div class="w-full h-full absolute" transition:slide>
				<div
					class="ken-burns"
					style="--scale: {transforms[index].scale}; --translateX: {transforms[index]
						.translateX}%; --translateY: {transforms[index].translateY}%;"
				>
					<Image imageObject={image} lazy={false} imageSize="medium" fit="cover" />
				</div>
			</div>
		{/if}
	{/each}
</div>

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
