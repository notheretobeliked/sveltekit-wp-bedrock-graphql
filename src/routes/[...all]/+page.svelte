<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import type { PageData } from './$types'
	export let data: PageData
	let editorBlocks: EditorBlock[], uri: string
	let bgColour: string
	let bgColourClass: string

	$: {
		bgColour = data.data.nodeByUri?.pageDesign?.bgColour?.slug || 'white-off'
		bgColourClass = getBgColorClass(bgColour)
	}

	function getBgColorClass(color: string | null): string {
		return color ? `bg-${color}` : 'bg-white'
	}

	let isHomePage: boolean = false

	$: {
		;({ editorBlocks, uri } = data)
		isHomePage = uri === '/'
	}
</script>

<div
	class="{isHomePage ? 'pt-[56px] pb-0' : 'pt-24'} min-h-screen {bgColourClass} {isHomePage
		? 'homepage'
		: ''} "
>
	{#each editorBlocks as block, index (block.clientId)}
		<BlockRenderer {block} />
	{/each}
</div>

<style>
</style>
