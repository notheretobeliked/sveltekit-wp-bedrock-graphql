<script lang="ts">
	import { isExpandedStore } from '$stores/expandedStore'
	import Button from './Button.svelte'
	import BlockRenderer from './BlockRenderer.svelte'
	import type { EditorBlock } from '$lib/graphql/generated'
	import { labelTranslations } from '$stores/translations'
	import { language } from '$stores/language'

	export let block: EditorBlock
	let showFullContent = false

	function toggleContent() {
		showFullContent = !showFullContent
		$isExpandedStore = showFullContent // Update the store
	}
</script>

<div>
	<div class="flex justify-center mt-8 mb-8">
		<div on:click={toggleContent}>
			<Button
			label={showFullContent
				? $labelTranslations.showless[$language]
				: $labelTranslations.readmore[$language]}
			active={showFullContent}
			url="#"
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
