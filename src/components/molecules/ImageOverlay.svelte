<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Image from '$components/Image.svelte';
	import type { ImageObject } from '$lib/types/wp-types';

	export let image: ImageObject;
	export let images: ImageObject[];
	export let currentIndex: number;

	const dispatch = createEventDispatcher();

	function close() {
		dispatch('close');
	}

	function navigate(direction: 'prev' | 'next') {
		dispatch('navigate', direction);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') navigate('prev');
		if (event.key === 'ArrowRight') navigate('next');
		if (event.key === 'Escape') close();
	}

	onMount(() => {
		document.addEventListener('keydown', handleKeydown);
		return () => {
			document.removeEventListener('keydown', handleKeydown);
		};
	});
</script>

<div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" on:click|self={close}>
	<div class="max-w-4xl max-h-[90vh] p-4 relative">
		<Image imageObject={image} imageSize="large" fit="contain" />
		<button
			class="absolute top-1/2 left-4 transform -translate-y-1/2 text-white text-4xl"
			on:click|stopPropagation={() => navigate('prev')}
		>
			&#8592;
		</button>
		<button
			class="absolute top-1/2 right-4 transform -translate-y-1/2 text-white text-4xl"
			on:click|stopPropagation={() => navigate('next')}
		>
			&#8594;
		</button>
		<div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white">
			{currentIndex + 1} / {images.length}
		</div>
	</div>
</div>

<style>
	button {
		background: rgba(0, 0, 0, 0.5);
		border: none;
		border-radius: 50%;
		width: 40px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: background 0.3s;
	}

	button:hover {
		background: rgba(0, 0, 0, 0.8);
	}
</style>