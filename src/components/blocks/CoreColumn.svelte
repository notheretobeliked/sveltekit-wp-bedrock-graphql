<script lang="ts">
	export let block: EditorBlock
	import BlockRenderer from '$components/BlockRenderer.svelte'
</script>

<div class="w-full pb-6 lg:pb-0">
		{#each block.children as block, index}
			<BlockRenderer {block} />
		{/each}
</div>
