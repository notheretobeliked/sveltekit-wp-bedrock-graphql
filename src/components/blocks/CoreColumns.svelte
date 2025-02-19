<script lang="ts">
	import type { CoreColumns } from '$lib/graphql/generated'
	export let block: CoreColumns
	import BlockRenderer from '$components/BlockRenderer.svelte'
	const columns = block.children.length
	const isStackedOnMobile: boolean = block.attributes?.isStackedOnMobile ?? false
</script>

<div
	class="{block.attributes?.className} grid {isStackedOnMobile ? `md:grid-cols-${columns}` : `grid-cols-${columns}`}  gap-7 mb-7 corecolumns"
>
	{#each block.children as block, index}
		<BlockRenderer {block} />
	{/each}
</div>
