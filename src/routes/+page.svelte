<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import type { PageData } from './$types'
	export let data: PageData
	let editorBlocks: EditorBlock[], uri: string

	$: {
		;({ editorBlocks, uri } = data)
	}
</script>

<main class="py-24 min-h-screen font-martina">
	{#each editorBlocks as block, index (block.clientId)}
		<BlockRenderer {block} />
	{/each}
</main>
