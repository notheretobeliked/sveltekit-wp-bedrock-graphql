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
		$isExpandedStore = showFullContent
		
		if (showFullContent) {
			// Wait for content to render before scrolling
			setTimeout(() => {
				document.getElementById('more')?.scrollIntoView({ 
					behavior: 'smooth',
					block: 'start'
				})
			}, 100)
		}
	}
</script>

<div>
	<div class="flex justify-center mt-8 mb-8">
		<button 
			on:click={toggleContent}
			on:keydown={(e) => e.key === 'Enter' && toggleContent()}
			type="button"
		>
			<Button
				label={showFullContent
					? $labelTranslations.showless[$language]
					: $labelTranslations.readmore[$language]}
				active={showFullContent}
				url="#"
			/>
		</button>
	</div>
	<div class="content-wrapper" id="more">
		{#if showFullContent}
		<div class="pb-12">
            {#each block.children as childBlock}
					<BlockRenderer block={childBlock} />
				{/each}
			</div>
		{/if}
	</div>
</div>

