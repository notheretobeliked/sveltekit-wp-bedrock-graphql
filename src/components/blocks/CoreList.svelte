<script lang="ts">
	import type { CoreList, EditorBlock } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	interface Props {
		block: CoreList & {
			children: EditorBlock[]
		}
	}

	let { block }: Props = $props()

	const isOrdered = block.attributes?.ordered

	const children = block.children
</script>

{#if isOrdered}
	<ol class="mb-4 list-decimal list-inside">
		{#each children as block, index}
			<BlockRenderer {block} />
		{/each}
	</ol>
{:else}
	<ul class="mb-4 list-disc list-inside">
		{#each children as block, index}
			<BlockRenderer {block} />
		{/each}
	</ul>
{/if}
