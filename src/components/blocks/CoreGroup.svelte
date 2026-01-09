<script lang="ts">
	import type { CoreGroup } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: CoreGroup & { children?: any[] }
	}

	let { block }: Props = $props()

	let children = $derived(block.children || [])
	let bgColor = $derived(block.attributes?.backgroundColor ?? 'white')
	let align = $derived(block.attributes?.align)

	let alignClass = $derived(
		align === 'wide'
			? 'alignwide'
			: align === 'full'
				? 'w-screen relative left-1/2 -translate-x-1/2'
				: align === 'center'
					? 'self-center'
					: align === 'left'
						? 'self-start'
						: align === 'right'
							? 'self-end'
							: ''
	)
</script>

<div class="px-2 md:px-0 {alignClass}">
	<div class="m-auto {bgColor === 'black' && '!text-white'}">
		{#each children as childBlock}
			<BlockRenderer block={childBlock} />
		{/each}
	</div>
</div>
