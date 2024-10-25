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

</style>