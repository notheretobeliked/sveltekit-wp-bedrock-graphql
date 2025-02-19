<script lang="ts">
	import { run } from 'svelte/legacy';

	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import type { PageData } from './$types'
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let editorBlocks: EditorBlock[] = $state(), uri: string = $state()
	let bgColour: string = $state()
	let bgColourClass: string = $state()


	function getBgColorClass(color: string | null): string {
		return color ? `bg-${color}` : 'bg-white'
	}

	let isHomePage: boolean = $state(false)

	run(() => {
		bgColour = data.data.nodeByUri?.pageDesign?.bgColour?.slug || 'white-off'
		bgColourClass = getBgColorClass(bgColour)
	});
	run(() => {
		;({ editorBlocks, uri } = data)
		isHomePage = uri === '/'
	});
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
