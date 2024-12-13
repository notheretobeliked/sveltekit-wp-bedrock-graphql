<script lang="ts">
	import type { EditorBlock } from '$lib/graphql/generated'
	import { onMount } from 'svelte';
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import Button from '$components/Button.svelte'
	import type { PageData } from './$types'
	
	export let data: PageData
	let editorBlocks: EditorBlock[], uri: string
	let showFullContent = false
	let visibleBlocks
	let hiddenBlocks

	$: {
		;({ editorBlocks, uri } = data as unknown as { editorBlocks: EditorBlock[], uri: string })
	}

	// Split blocks at read-more block
	$: {
		const readMoreIndex = editorBlocks?.findIndex(block => block.name === 'core/read-more')
		visibleBlocks = readMoreIndex === -1 
			? editorBlocks 
			: editorBlocks.slice(0, readMoreIndex)
		
		hiddenBlocks = readMoreIndex === -1
			? [] 
			: editorBlocks.slice(readMoreIndex + 1)
	}

	let lang = data.languageCode as 'ar' | 'en'
	let headerHeight: number;

	onMount(() => {
		const header = document.getElementById('top-bar');
		if (header) {
			headerHeight = header.clientHeight;
		}
	});

	function handleReadMore() {
		showFullContent = !showFullContent
	}
</script>

<main class="min-h-screen {lang === 'ar' ? 'main-ar' : ''}" style="padding-top: {headerHeight}px;">
	{#each visibleBlocks as block (block.clientId)}
		<BlockRenderer {block} />
	{/each}

	{#if hiddenBlocks.length > 0}
		<div class="flex justify-center mt-8">
			<div on:click={handleReadMore}>
				<Button 
					label={showFullContent ? 'Show Less' : 'Read More'} 
					active={showFullContent}
					url="#"
				/>
			</div>
		</div>

		{#if showFullContent}
			<div transition:slide>
				{#each hiddenBlocks as block (block.clientId)}
					<BlockRenderer {block} />
				{/each}
			</div>
		{/if}
	{/if}
</main>