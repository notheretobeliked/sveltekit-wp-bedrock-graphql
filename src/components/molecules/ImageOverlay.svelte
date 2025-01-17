<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import { browser } from '$app/environment'
	import { fade } from 'svelte/transition'

	import type { ImageObject } from '$lib/types/wp-types.ts'

	export let image: ImageObject
	export let images: ImageObject[]
	export let currentIndex: number

	function encodeSvg(svg: string) {
		return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg.trim())}`
	}

	// Then use it like this:
	const zoomInIcon = encodeSvg(`
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M12 4V20M4 12H20" stroke="white" stroke-width="2" stroke-linecap="round"/>
		</svg>
	`)

	const zoomOutIcon = encodeSvg(`
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M4 12H20" stroke="white" stroke-width="2" stroke-linecap="round"/>
		</svg>
	`)

	const homeIcon = encodeSvg(`
		<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M15 9L21 3M21 3H16.3333M21 3V7.66667" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M10 9L4 3M4 3H8.66667M4 3V7.66667" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M15 15L21 21M21 21L21 16.3333M21 21L16.3333 21" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M10 15L4 21M4 21L4 16.3333M4 21L8.66667 21" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
		</svg>
	`)

	const dispatch = createEventDispatcher()
	let viewer
	let viewerElement: HTMLElement

	function close() {
		dispatch('close')
	}

	function navigate(direction: 'prev' | 'next') {
		dispatch('navigate', direction)
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') navigate('prev')
		if (event.key === 'ArrowRight') navigate('next')
		if (event.key === 'Escape') close()
	}

	$: if (viewer && image) {
		viewer.open({
			type: 'image',
			url: image.sourceUrl,
			buildPyramid: false,
			crossOriginPolicy: 'Anonymous',
			format: 'jpg'
		})
	}

	onMount(async () => {
		if (!browser) return

		// Initialize OpenSeadragon
		// Dynamically import OpenSeadragon
		const OpenSeadragon = (await import('openseadragon')).default

		viewer = OpenSeadragon({
			element: viewerElement,
			prefixUrl: '', // Set to empty string

			navImages: {
				zoomIn: {
					REST: zoomInIcon,
					GROUP: zoomInIcon,
					HOVER: zoomInIcon,
					DOWN: zoomInIcon
				},
				zoomOut: {
					REST: zoomOutIcon,
					GROUP: zoomOutIcon,
					HOVER: zoomOutIcon,
					DOWN: zoomOutIcon
				},
				home: {
					REST: homeIcon,
					GROUP: homeIcon,
					HOVER: homeIcon,
					DOWN: homeIcon
				}
			},
			loadTilesWithAjax: true, // Add this line
			defaultZoomLevel: 0,
			minZoomLevel: 0.1,
			maxZoomLevel: 10,
			visibilityRatio: 1,
			constrainDuringPan: true,
			showNavigationControl: true,
			navigationControlAnchor: OpenSeadragon.ControlAnchor.TOP_LEFT,

			showFullPageControl: false,
			gestureSettingsMouse: {
				clickToZoom: true,
				dblClickToZoom: true,
				pinchToZoom: true,
				scrollToZoom: true
			}
		})

		document.addEventListener('keydown', handleKeydown)
		return () => {
			document.removeEventListener('keydown', handleKeydown)
			viewer?.destroy()
		}
	})
</script>

<div
	class="fixed inset-0 bg-black flex items-center justify-center z-50 w-full h-full"
	on:click|self={close}
	on:keydown={handleKeydown}
	role="dialog"
	aria-modal="true"
	transition:fade={{ duration: 300 }}
>
	<div class="max-w-[90vw] h-[90vh] p-4 w-full h-full relative">
		<div bind:this={viewerElement} class="w-full h-full" />

		{#if images.length > 1}
			<button
				class="fixed top-1/2 left-12 transform -translate-y-1/2 text-white-pure z-[60]"
				on:click|stopPropagation={() => navigate('prev')}
				on:keydown={(e) => e.key === 'Enter' && navigate('prev')}
			>
				<svg
					width="18"
					height="35"
					viewBox="0 0 18 35"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M17 1L1 17.5L17 34"
						stroke="white"
						stroke-width="1"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
			<button
				class="fixed top-1/2 right-12 transform -translate-y-1/2 text-white-pure z-[60]"
				on:click|stopPropagation={() => navigate('next')}
				on:keydown={(e) => e.key === 'Enter' && navigate('next')}
			>
				<svg
					width="18"
					height="35"
					viewBox="0 0 18 35"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M1 1L17 17.5L1 34"
						stroke="white"
						stroke-width="1"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{/if}
		<button
			class="fixed top-12 right-12 text-white-pure z-[60]"
			on:click={close}
			on:keydown={(e) => e.key === 'Enter' && close()}
		>
			<svg
				width="35"
				height="35"
				viewBox="0 0 35 35"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M1 1L34 34M34 1L1 34"
					stroke="white"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</button>
	</div>
</div>

<style>
	button {
		background: transparent;
		border: none;
		cursor: pointer;
		padding: 0;
	}

	button:hover svg path {
		stroke-width: 3;
	}

	:global(.openseadragon-container) {
		width: 100% !important;
		height: 100% !important;
	}
</style>
