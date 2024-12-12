<script lang="ts">
	import { isExpandedStore } from '$stores/expandedStore'
	import Button from './Button.svelte'
	import BlockRenderer from './BlockRenderer.svelte'
	import type { EditorBlock } from '$lib/graphql/generated'

	export let block: EditorBlock
	let showFullContent = false

	function toggleContent() {
		console.log('Toggle clicked, current state:', showFullContent)
		showFullContent = !showFullContent
		$isExpandedStore = showFullContent // Update the store
		console.log('New state:', showFullContent)
	}
</script>

<div>
	<div class="flex justify-center mt-8 mb-8">
		<div on:click={toggleContent}>
			<Button
				label={showFullContent ? 'Show Less' : 'Read More'}
				url="#"
				active={showFullContent}
			/>
		</div>
	</div>
	<div class="content-wrapper">
		{#if showFullContent}
		<div class="pb-12">
            {#each block.children as childBlock}
					<BlockRenderer block={childBlock} />
				{/each}
			</div>
		{/if}
	</div>
</div>
