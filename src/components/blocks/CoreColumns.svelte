<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreColumnsAttributes, CoreColumnAttributes } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CoreColumnsAttributes | undefined)

	function presetToSpacing(value: string): string | null {
		const match = value.match(/(?:var:preset\|)?spacing\|(\d+)/)
		if (match) return String(parseInt(match[1], 10) / 10)
		return null
	}

	// Create CSS grid template columns from individual column widths.
	// Convert percentages to fr units so gaps don't cause overflow
	// (e.g. "50% 50%" + gap = >100%, but "50fr 50fr" + gap = exactly 100%).
	let gridTemplateColumns = $derived.by(() => {
		const children = block.children || []
		return children.map((child: EditorBlock) => {
			const childAttrs = child.attributes as CoreColumnAttributes | undefined
			const width = childAttrs?.width
			if (!width) return '1fr'
			const pct = parseFloat(width)
			if (!isNaN(pct)) return `${pct}fr`
			return width
		}).join(' ') || '1fr'
	})

	let isStackedOnMobile = $derived(attrs?.isStackedOnMobile ?? false)

	let gapClass = $derived.by(() => {
		const raw = attrs?.style
		if (!raw) return 'gap-4'
		try {
			const style = typeof raw === 'string' ? JSON.parse(raw) : raw
			const blockGap = style?.spacing?.blockGap
			if (blockGap) {
				const tw = presetToSpacing(blockGap)
				if (tw) return `gap-${tw}`
			}
		} catch { /* use default */ }
		return 'gap-4'
	})

	let cssClasses = $derived(`${attrs?.className || ''} corecolumns grid ${gapClass}`.trim())
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
	{#each children as childBlock, i}
		<BlockRenderer block={childBlock} staggerIndex={i} />
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
