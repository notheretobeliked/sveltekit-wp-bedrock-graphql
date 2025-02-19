<script lang="ts">
	import BlockRenderer from '$components/BlockRenderer.svelte'
	interface Props {
		block: EditorBlock;
	}

	let { block }: Props = $props();
	const children = block.children
	const bgColor = block.attributes.backgroundColor ?? 'white'
</script>

<div class="px-2 md:px-0">
	<div class="m-auto {bgColor === 'black' && '!text-white-pure'}">
		{#each children as block, index}
			<BlockRenderer {block} />
		{/each}
	</div>
</div>
