<script lang="ts">
	import type { CoreColumns } from '$lib/graphql/generated'
	export let block: CoreColumns
	import BlockRenderer from '$components/BlockRenderer.svelte'
	const columns = block.children.length
	import { language } from '$stores/language'
	console.log(block)
	const isStackedOnMobile: boolean = block.attributes?.isStackedOnMobile ?? false
  console.log(isStackedOnMobile)
</script>

<div
	class="{block.attributes?.className} grid {isStackedOnMobile ? `md:grid-cols-${columns}` : `grid-cols-${columns}`}  gap-7 mb-7 corecolumns"
	style="direction: {$language === 'ar' ? 'rtl' : 'ltr'}"
>
	{#each block.children as block, index}
		<BlockRenderer {block} />
	{/each}
</div>
