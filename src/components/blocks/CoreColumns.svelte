<script lang="ts">
	import type { CoreColumns, EditorBlock, CoreColumn, CoreColumnAttributes } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	type CoreColumnExtended = CoreColumn & { children?: EditorBlock[]; attributes?: CoreColumnAttributes }

	interface Props {
		block: CoreColumns & { children?: CoreColumnExtended[] }
	}

	let { block }: Props = $props()

	// Create CSS grid template columns from individual column widths.
	// Convert percentages to fr units so gaps don't cause overflow
	// (e.g. "50% 50%" + gap = >100%, but "50fr 50fr" + gap = exactly 100%).
	let gridTemplateColumns = $derived.by(() => {
		const children = block.children || []
		return children.map((child: CoreColumnExtended) => {
			const width = child.attributes?.width
			if (!width) return '1fr'
			const pct = parseFloat(width)
			if (!isNaN(pct)) return `${pct}fr`
			return width
		}).join(' ') || '1fr'
	})

	let isStackedOnMobile = $derived(block.attributes?.isStackedOnMobile ?? false)
	let align = $derived(block.attributes?.align)

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

	let cssClasses = $derived(`${block.attributes?.className || ''} ${alignClass} corecolumns grid gap-7 mb-7`.trim())
	let gridStyle = $derived(
		isStackedOnMobile
			? `grid-template-columns: 1fr; --grid-columns: ${gridTemplateColumns};`
			: `grid-template-columns: ${gridTemplateColumns};`
	)
	let children = $derived(block.children || [])
</script>

<div
	class={cssClasses}
	data-stacked={isStackedOnMobile}
	style={gridStyle}
>
	{#each children as childBlock}
		<BlockRenderer block={childBlock} />
	{/each}
</div>

<style>
	.corecolumns > :global(*) {
		min-width: 0;
	}

	@media (min-width: 768px) {
		.corecolumns[data-stacked='true'] {
			grid-template-columns: var(--grid-columns) !important;
		}
	}
</style>
