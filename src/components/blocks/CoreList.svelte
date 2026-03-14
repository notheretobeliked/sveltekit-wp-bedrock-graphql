<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreListAttributes } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CoreListAttributes | undefined)

	let isOrdered = $derived(attrs?.ordered)
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
