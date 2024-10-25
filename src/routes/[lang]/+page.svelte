<script lang="ts">
	import type { EditorBlock } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import type { PageData } from './$types'
	export let data: PageData
	let editorBlocks: EditorBlock[], uri: string
	console.log(data)
	$: {
		;({ editorBlocks, uri } = data as unknown as { editorBlocks: EditorBlock[], uri: string })
	}
</script>

<main class="py-24 min-h-screen">
	{#each editorBlocks as block, index (block.clientId)}
		<BlockRenderer {block} />
	{/each}
</main>
