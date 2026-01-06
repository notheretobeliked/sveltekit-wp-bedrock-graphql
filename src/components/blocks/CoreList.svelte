<script lang="ts">
	import type { CoreList, EditorBlock } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: CoreList & {
			children: EditorBlock[]
		}
	}

	let { block }: Props = $props()

	let isOrdered = $derived(block.attributes?.ordered)
	let children = $derived(block.children || [])
</script>

{#if isOrdered}
	<ol class="mb-4 list-decimal list-inside">
		{#each children as childBlock}
			<BlockRenderer block={childBlock} />
		{/each}
	</ol>
{:else}
	<ul class="mb-4 list-disc list-inside">
		{#each children as childBlock}
			<BlockRenderer block={childBlock} />
		{/each}
	</ul>
{/if}
