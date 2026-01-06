<script lang="ts">
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import type { PageData } from './$types'
	import PreviewBanner from '$lib/components/PreviewBanner.svelte'

	interface Props {
		data: PageData
	}

	let { data }: Props = $props()
	let editorBlocks = $derived(data.editorBlocks ?? [])
</script>

<PreviewBanner
	isPreview={data.isPreview}
	lastModified={data.previewData?.lastModified}
	canEdit={data.previewData?.canEdit}
/>

<div class="pt-24 min-h-screen">
	{#each editorBlocks as block (block.clientId)}
		<BlockRenderer {block} />
	{/each}
</div>
