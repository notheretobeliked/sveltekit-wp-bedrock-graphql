<script lang="ts">
	import type { AcfHomePageBlock } from '$lib/graphql/generated'
	export let block: AcfHomePageBlock
	const content = block.children ?? [] // Provide a default empty array
	import BlockRenderer from '$components/BlockRenderer.svelte'
</script>

{#if content}
	<div class="flex flex-col" style="height: calc(100vh - var(--header-height));" id="homepage-container">
		{#each content as block}
			<BlockRenderer {block} />
		{/each}
	</div>
{/if}

<style lang="postcss">
:global(div#homepage-container>div) {
	height: calc(100vh - var(--header-height));
}
:global(div#homepage-container>div div.grid) {
	gap:0;
	margin-bottom: 0 !important;
	height: calc(100vh - var(--header-height));
}

:global(div#homepage-container>div div.grid>div:first-child>div) {
	height: calc(100vh - var(--header-height));
	@apply flex flex-col gap-0;
}

:global(div#homepage-container>div div.grid>div:last-child) {
	@apply lg:max-h-[calc(100vh-var(--header-height))] lg:overflow-y-auto max-w-[600px] mx-auto px-6 pt-16;
}

:global(div#homepage-container>div div.grid>div:first-child>div>div) {
	@apply h-full lg:h-[calc((100vh-var(--header-height))/4)];

	@apply cursor-pointer;
}

:global(div#homepage-container>div div.grid>div:first-child>div>div>div) {
	@apply flex flex-col justify-center;
}



:global(div#homepage-container>div div.grid h2.font-boogy) {
	@apply !mb-0;
}

</style>