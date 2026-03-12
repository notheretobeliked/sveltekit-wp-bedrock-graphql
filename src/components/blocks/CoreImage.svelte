<script lang="ts">
	import type { CoreImage } from '$lib/graphql/generated'

	interface Props {
		block: CoreImage
	}

	let { block }: Props = $props()

	let sizes = $derived(block.mediaDetails?.sizes ?? [])
	let src = $derived(block.attributes?.url ?? '')
	let alt = $derived(block.attributes?.alt ?? '')
	let caption = $derived(block.attributes?.caption)
	let align = $derived(block.attributes?.align)
	let aspectRatio = $derived(block.attributes?.aspectRatio)
	let customWidth = $derived(block.attributes?.width)
	let customHeight = $derived(block.attributes?.height)

	// Only use srcset if the full-size src is represented in the sizes array.
	// Otherwise the browser picks a small thumbnail instead of the full original.
	let hasSrcInSizes = $derived(sizes.some((s) => s?.sourceUrl === src))
	let srcSet = $derived(
		hasSrcInSizes
			? sizes
					.filter((s) => s?.sourceUrl && s?.width)
					.map((s) => `${s!.sourceUrl} ${s!.width}w`)
					.join(', ')
			: ''
	)

	let borderRadius = $derived.by(() => {
		const raw = block.attributes?.style
		if (!raw) return ''
		try {
			const style = typeof raw === 'string' ? JSON.parse(raw) : raw
			const radius = style?.border?.radius
			if (!radius) return ''
			if (typeof radius === 'string') return radius
			const { topLeft, topRight, bottomRight, bottomLeft } = radius
			return `${topLeft ?? '0'} ${topRight ?? '0'} ${bottomRight ?? '0'} ${bottomLeft ?? '0'}`
		} catch {
			return ''
		}
	})

	let imgStyle = $derived.by(() => {
		const parts: string[] = []
		if (customWidth) parts.push(`width:${customWidth}`)
		if (customHeight) parts.push(`height:${customHeight}`)
		if (aspectRatio) parts.push(`aspect-ratio:${aspectRatio}`)
		if (borderRadius) parts.push(`border-radius:${borderRadius}`)
		return parts.join(';')
	})

	let alignClass = $derived(
		align === 'wide'
			? 'alignwide'
			: align === 'full'
				? 'w-screen relative left-1/2 -translate-x-1/2'
				: align === 'center'
					? 'w-fit mx-auto'
					: align === 'left'
						? 'self-start'
						: align === 'right'
							? 'self-end'
							: ''
	)

	let isFullWidth = $derived(align === 'full' || align === 'wide')

	let imgClass = $derived(
		customWidth || customHeight
			? 'h-auto max-w-full'
			: isFullWidth
				? 'w-full h-auto'
				: 'max-w-full h-auto'
	)
</script>

{#if src}
	<figure class="{alignClass} {isFullWidth ? 'w-full' : ''} relative @container">
		<img
			{src}
			{alt}
			srcset={srcSet || undefined}
			sizes={srcSet ? '100vw' : undefined}
			class={imgClass}
			style={imgStyle || undefined}
			loading="lazy"
		/>
		{#if caption}
			<figcaption class="font-sans text-sm mt-2 text-center">{@html caption}</figcaption>
		{/if}
	</figure>
{/if}
