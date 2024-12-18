<script lang="ts">
	import type { CoreFootnotes } from '$lib/graphql/generated'
	export let block: CoreFootnotes
	console.log(block)
</script>

{#if block.renderedHtml}<div class="footnotes">{@html block.renderedHtml}</div>{/if}

<style lang="postcss">
	.footnotes :global(ol) {
		@apply list-decimal;
	}

    .footnotes :global(li) {
		@apply font-martina text-sm lg:text-base;
	}

    
</style>
