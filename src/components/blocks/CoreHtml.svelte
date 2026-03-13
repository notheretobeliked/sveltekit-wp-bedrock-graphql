<script lang="ts">
	interface Props {
		block: { renderedHtml?: string | null }
	}

	let { block }: Props = $props()

	let html = $derived(block.renderedHtml ?? '')
</script>

{#if html}
	{@html html}
{/if}
