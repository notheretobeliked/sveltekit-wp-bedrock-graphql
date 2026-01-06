<script lang="ts">
	import type { CoreVideo } from '$lib/graphql/generated'

	interface Props {
		block: CoreVideo
	}

	let { block }: Props = $props()

	// Extract video attributes with safe defaults using $derived
	let src = $derived(block.attributes?.src || '')
	let poster = $derived(block.attributes?.poster || '')
	let autoplay = $derived(block.attributes?.autoplay || false)
	let muted = $derived(block.attributes?.muted || false)
	let controls = $derived(block.attributes?.controls !== false)
	let loop = $derived(block.attributes?.loop || false)
	let caption = $derived(block.attributes?.caption || '')
	let customClasses = $derived(block.attributes?.className || '')

	// Make sure preload is a valid value
	let preload = $derived.by(() => {
		const rawPreload = block.attributes?.preload || 'metadata'
		return ['auto', 'metadata', 'none'].includes(rawPreload)
			? (rawPreload as 'auto' | 'metadata' | 'none')
			: 'metadata'
	})
</script>

<figure class={`mb-4 w-full ${customClasses}`}>
	{#if src}
		<video
			{src}
			{poster}
			{preload}
			{controls}
			{autoplay}
			{muted}
			{loop}
			class="w-full h-auto"
			playsinline
		>
			Your browser does not support the video tag.
		</video>
	{:else}
		<div class="bg-gray-200 p-4 text-center text-gray-500">
			Video source not available
		</div>
	{/if}

	{#if caption}
		<figcaption class="font-sans mt-2 text-center text-sm">
			{@html caption}
		</figcaption>
	{/if}
</figure>
