<script lang="ts">
	import type { CoreColumns, EditorBlock, CoreColumn, CoreColumnAttributes } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	type CoreColumnExtended = CoreColumn & { children?: EditorBlock[]; attributes?: CoreColumnAttributes }

	interface Props {
		block: CoreColumns & { children?: CoreColumnExtended[] }
	}

	let { block }: Props = $props()

	const isStackedOnMobile: boolean = block.attributes?.isStackedOnMobile ?? false

	// Create CSS grid template columns from individual column widths
	function getGridTemplateColumns(): string {
		const children = block.children || []
		return children.map((child: CoreColumnExtended) => child.attributes?.width || '1fr').join(' ') || '1fr'
	}

	// Get the grid style object
	function getGridStyle(): string {
		const gridTemplateColumns = getGridTemplateColumns()
		return `grid-template-columns: ${gridTemplateColumns};`
	}

	// Get CSS classes for responsive behavior
	function getCssClasses(): string {
		const baseClasses = `${block.attributes?.className || ''} corecolumns grid gap-7 mb-7`
		return baseClasses.trim()
	}
</script>

<div
	class={getCssClasses()}
	data-stacked={isStackedOnMobile}
	style={isStackedOnMobile ? `grid-template-columns: 1fr; --grid-columns: ${getGridTemplateColumns()};` : getGridStyle()}
>
	{#each block.children || [] as childBlock}
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
