<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreVideoAttributes } from '$lib/graphql/generated'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CoreVideoAttributes | undefined)

	// Extract video attributes with safe defaults using $derived
	let src = $derived(attrs?.src || '')
	let poster = $derived(attrs?.poster || '')
	let autoplay = $derived(attrs?.autoplay || false)
	let muted = $derived(attrs?.muted || false)
	let controls = $derived(attrs?.controls !== false)
	let loop = $derived(attrs?.loop || false)
	let caption = $derived(attrs?.caption || '')
	let customClasses = $derived(attrs?.className || '')
	let align = $derived(attrs?.align)

	let alignClass = $derived(
		align === 'wide'
			? 'alignwide'
			: align === 'full'
				? 'w-screen relative left-1/2 -translate-x-1/2'
				: align === 'center'
					? 'self-center'
					: align === 'left'
						? 'self-start'
						: align === 'right'
							? 'self-end'
							: ''
	)

	// Make sure preload is a valid value
	let preload = $derived.by(() => {
		const rawPreload = attrs?.preload || 'metadata'
		return ['auto', 'metadata', 'none'].includes(rawPreload)
			? (rawPreload as 'auto' | 'metadata' | 'none')
			: 'metadata'
	})
</script>

<figure class={`w-full ${alignClass} ${customClasses}`}>
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
