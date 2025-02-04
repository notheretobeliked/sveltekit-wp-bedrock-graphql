<script lang="ts">
	import type { CoreParagraph } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'
	import { language } from '$stores/language' 

	export let block: CoreParagraph

	$: isArabic = $language === 'ar'

	console.log($language)
    const {
        content = '',
        fontSize = 'base',
        textColor = 'black',
        align = 'left',
        fontFamily = null
    } = block.attributes ?? {}

    // Use nullish coalescing to provide a default when null
    const defaultFontFamily = fontFamily ?? 'martina'
    
    console.log('Initial fontFamily:', defaultFontFamily)
    console.log('Current language:', $language)
    
    $: finalFontFamily = $language === 'ar' ? 'lyon' : defaultFontFamily
    $: console.log('finalFontFamily:', finalFontFamily)
	
    $: finalAlign = $language === 'ar' ? 'right' : align



</script>

<!-- Use the class directive in Svelte to dynamically set classes -->
{#if content}
	<p
		class="{classNames(
			fontSize || 'base',
			textColor || 'black',
			finalAlign || 'left',
			finalFontFamily || 'martina',
			isArabic
		)} mb-4 mx-2 lg:mx-0"
	>
	{@html content}
</p>

{/if}
