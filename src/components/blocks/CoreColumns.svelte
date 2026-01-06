<script lang="ts">
	import type { CoreColumns, EditorBlock, CoreColumn, CoreColumnAttributes } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	type CoreColumnExtended = CoreColumn & { children?: EditorBlock[]; attributes?: CoreColumnAttributes }

	interface Props {
		block: CoreColumns & { children?: CoreColumnExtended[] }
	}

	let { block }: Props = $props()

	// Create CSS grid template columns from individual column widths
	let gridTemplateColumns = $derived.by(() => {
		const children = block.children || []
		return children.map((child: CoreColumnExtended) => child.attributes?.width || '1fr').join(' ') || '1fr'
	})

	let isStackedOnMobile = $derived(block.attributes?.isStackedOnMobile ?? false)
	let cssClasses = $derived(`${block.attributes?.className || ''} corecolumns grid gap-7 mb-7`.trim())
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
	@media (min-width: 768px) {
		.corecolumns[data-stacked='true'] {
			grid-template-columns: var(--grid-columns) !important;
		}
	}
</style>
