<script lang="ts">
	import type { CoreVideo } from '$lib/graphql/generated'

	interface Props {
		block: CoreVideo
	}

	let { block }: Props = $props()

	// Extract video attributes with safe defaults
	const src = block.attributes?.src || ''
	const poster = block.attributes?.poster || ''
	const autoplay = block.attributes?.autoplay || false
	const muted = block.attributes?.muted || false
	const controls = block.attributes?.controls !== false // Default to true if not specified
	const loop = block.attributes?.loop || false

	// Make sure preload is a valid value
	const rawPreload = block.attributes?.preload || 'metadata'
	const preload: 'auto' | 'metadata' | 'none' =
		['auto', 'metadata', 'none'].includes(rawPreload)
			? (rawPreload as 'auto' | 'metadata' | 'none')
			: 'metadata'

	const caption = block.attributes?.caption || ''

	// Additional CSS classes
	const customClasses = block.attributes?.className || ''
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
		<figcaption class="font-inter mt-2 text-center text-sm">
			{@html caption}
		</figcaption>
	{/if}
</figure>
