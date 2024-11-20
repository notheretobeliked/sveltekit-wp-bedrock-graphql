<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import type { PageData } from './$types'
	export let data: PageData
	console.log(data)
	let editorBlocks: EditorBlock[], uri: string
	let bgColour = data.data.nodeByUri.pageDesign.bgColour.slug
	console.log(bgColour)

	function getBgColorClass(color: string | null): string {
		return color ? `bg-${color}` : ''
	}

	$: {
		;({ editorBlocks, uri } = data)
	}
</script>

<main class="py-24 min-h-screen bg-{bgColour}">
	{#each editorBlocks as block, index (block.clientId)}
		<BlockRenderer {block} />
	{/each}
</main>
