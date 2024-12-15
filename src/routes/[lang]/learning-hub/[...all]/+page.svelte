<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import PostsHeader from '$components/atoms/PostsHeader.svelte'
	import type { PageData } from './$types'
	export let data: PageData
	let editorBlocks: EditorBlock[], uri: string
	let bgColour = data.data.nodeByUri?.pageDesign?.bgColour?.slug || 'white-off'
	$: bgColourClass = getBgColorClass(bgColour)

	function getBgColorClass(color: string | null): string {
		return color ? `bg-${color}` : ''
	}
	$: {
		;({ editorBlocks, uri } = data)
	}
</script>

<div class="py-24 min-h-screen {bgColourClass}">
	<div class="core/paragraph w-full max-w-screen-md mx-auto !px-0">
		<PostsHeader
			byline={data.data.nodeByUri.learningHubFields.byline}
			title={data.data.nodeByUri.title}
			date={data.data.nodeByUri.date}
		/>
	</div>
	{#each editorBlocks as block, index (block.clientId)}
		<BlockRenderer {block} />
	{/each}
</div>
