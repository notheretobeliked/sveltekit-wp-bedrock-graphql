<script lang="ts">
	export let block: EditorBlock
	import BlockRenderer from '$components/BlockRenderer.svelte'
</script>

<div class="w-full @container">
		{#each block.children as block, index}
			<BlockRenderer {block} />
		{/each}
</div>
