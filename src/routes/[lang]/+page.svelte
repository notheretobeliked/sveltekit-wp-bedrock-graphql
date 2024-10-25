<script lang="ts">
	import type { EditorBlock } from '$lib/graphql/generated'
	import { onMount } from 'svelte';
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import type { PageData } from './$types'
	export let data: PageData
	let editorBlocks: EditorBlock[], uri: string
	console.log(data)
	$: {
		;({ editorBlocks, uri } = data as unknown as { editorBlocks: EditorBlock[], uri: string })
	}
	let lang = data.languageCode as 'ar' | 'en'
	let headerHeight: number;

	onMount(() => {
		const header = document.getElementById('top-bar');
		if (header) {
			headerHeight = header.clientHeight;
		}
	});

</script>


<main class="min-h-screen {lang === 'ar' ? 'main-ar' : ''}" style="padding-top: {headerHeight}px;">
	{#each editorBlocks as block, index (block.clientId)}
		<BlockRenderer {block} />
	{/each}
</main>
