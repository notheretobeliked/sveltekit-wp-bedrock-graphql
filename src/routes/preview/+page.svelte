<script lang="ts">
	import { run } from 'svelte/legacy'
	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import type { PageData } from './$types'
	import PreviewBanner from '$lib/components/PreviewBanner.svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
	let editorBlocks: any[] = $state([])
	let uri: string = $state('')
	let isHomePage: boolean = $state(false)

	run(() => {
		editorBlocks = data.editorBlocks || []
		uri = data.uri || ''
		isHomePage = uri === '/'
	})
</script>

<PreviewBanner 
	isPreview={data.isPreview || false}
	lastModified={data.previewData?.lastModified || null}
	canEdit={data.previewData?.canEdit || false}
/>

<div class="{isHomePage ? 'homepage' : ''} app-content">
	{#each editorBlocks as block, index (block.clientId)}
		<BlockRenderer {block} />
	{/each}
</div>
