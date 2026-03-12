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
	<ol class="list-decimal list-outside">
		{#each children as childBlock}
			<BlockRenderer block={childBlock} />
		{/each}
	</ol>
{:else}
	<ul class="list-disc list-outside">
		{#each children as childBlock}
			<BlockRenderer block={childBlock} />
		{/each}
	</ul>
{/if}
