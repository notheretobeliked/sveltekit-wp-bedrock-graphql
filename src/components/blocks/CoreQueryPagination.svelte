<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let children = $derived(block.children ?? [])
	let paginationData = $derived(block.paginationData)
	let layout = $derived.by(() => {
		const layoutAttr = block.attributes?.layout
		if (!layoutAttr) return { type: 'flex', justifyContent: 'space-between' }
		try {
			return typeof layoutAttr === 'string' ? JSON.parse(layoutAttr) : layoutAttr
		} catch {
			return { type: 'flex', justifyContent: 'space-between' }
		}
	})

	let justifyClass = $derived.by(() => {
		switch (layout.justifyContent) {
			case 'left':
				return 'justify-start'
			case 'center':
				return 'justify-center'
			case 'right':
				return 'justify-end'
			case 'space-between':
			default:
				return 'justify-between'
		}
	})
</script>

<nav class="flex items-center gap-2 {justifyClass}" aria-label="Pagination">
	{#each children as childBlock}
		<BlockRenderer block={paginationData ? { ...childBlock, paginationData } : childBlock} />
	{/each}
</nav>
