<script lang="ts">
	import type { CoreParagraph } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'
	import { language } from '$stores/language' 

	export let block: CoreParagraph

	const {
		content = '',
		fontSize = 'base',
		textColor = 'black',
		align = 'left',
		fontFamily = 'martina'
		
	} = block.attributes ?? {}

	
    $: finalAlign = $language === 'ar' ? 'right' : align


</script>

<!-- Use the class directive in Svelte to dynamically set classes -->
{#if content}
	<p
		class="{classNames(
			fontSize || 'base',
			textColor || 'black',
			finalAlign || 'left',
			fontFamily || 'martina'
		)} mb-4"
	>
	{@html content}
</p>

{/if}
