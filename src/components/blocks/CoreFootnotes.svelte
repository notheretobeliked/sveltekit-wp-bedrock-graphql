<script lang="ts">
	import type { CoreFootnotes } from '$lib/graphql/generated'

	interface Props {
		block: CoreFootnotes
	}

	let { block }: Props = $props()

	let renderedHtml = $derived(block.renderedHtml ?? '')
</script>

{#if renderedHtml}
	<div class="footnotes">
		{@html renderedHtml}
	</div>
{/if}
