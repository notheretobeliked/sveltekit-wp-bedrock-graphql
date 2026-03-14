<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let html = $derived(block.renderedHtml ?? '')
</script>

{#if html}
	{@html html}
{/if}
