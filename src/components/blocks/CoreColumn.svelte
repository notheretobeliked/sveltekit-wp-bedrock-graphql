<script lang="ts">
	import BlockRenderer from '$components/BlockRenderer.svelte'
	interface Props {
		block: EditorBlock;
	}

	let { block }: Props = $props();
</script>

<div class="w-full pb-6 lg:pb-0">
		{#each block.children as block, index}
			<BlockRenderer {block} />
		{/each}
</div>
