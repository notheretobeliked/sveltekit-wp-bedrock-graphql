<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte'
	import { fade } from 'svelte/transition'
	import Image from '$components/Image.svelte'
	import type { ImageObject } from '$lib/types/wp-types'

	export let image: ImageObject
	export let images: ImageObject[]
	export let currentIndex: number

	const dispatch = createEventDispatcher()

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

	onMount(() => {
		document.addEventListener('keydown', handleKeydown)
		return () => {
			document.removeEventListener('keydown', handleKeydown)
		}
	})
</script>

<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
<div
	class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
	on:click|self={close}
	on:keydown={handleKeydown}
	role="dialog"
	aria-modal="true"
	transition:fade={{ duration: 300 }}
>
	<div class="max-w-[70vw] h-[70vh] p-4 relative">
		{#key currentIndex}
			<div class="contents">
				<Image imageObject={image} imageSize="large" fit="contain" />
			</div>
		{/key}
		{#if images.length > 1}
			<button
				class="fixed top-1/2 left-12 transform -translate-y-1/2 text-white-pure"
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
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
			<button
				class="fixed top-1/2 right-12 transform -translate-y-1/2 text-white-pure"
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
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					/>
				</svg>
			</button>
		{/if}
		<button
			class="fixed top-12 right-12 text-white-pure"
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
</style>
