<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let children = $derived(block.children ?? [])
</script>

<div>
	{#each children as childBlock}
		<BlockRenderer block={childBlock} />
	{/each}
</div>
