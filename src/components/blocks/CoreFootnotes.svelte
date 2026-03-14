<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let renderedHtml = $derived(block.renderedHtml ?? '')
</script>

{#if renderedHtml}
	<div class="footnotes">
		{@html renderedHtml}
	</div>
{/if}
