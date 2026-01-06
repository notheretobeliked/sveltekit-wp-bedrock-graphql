<script lang="ts">
	import type { CoreGroup } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: CoreGroup & { children?: any[] }
	}

	let { block }: Props = $props()
	const children = block.children || []
	const bgColor = block.attributes?.backgroundColor ?? 'white'
</script>

<div class="px-2 md:px-0">
	<div class="m-auto {bgColor === 'black' && '!text-white'}">
		{#each children as childBlock}
			<BlockRenderer block={childBlock} />
		{/each}
	</div>
</div>
