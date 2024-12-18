<script lang="ts">
	import type { CoreHeading } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'
	import { language } from '$stores/language'

	export let block: CoreHeading
	const {
		content = '',
		fontSize = 'base',
		textColor = '',
		textAlign = 'left',
		level = 1,
		fontFamily = 'martina',
		className = ''
	} = block.attributes ?? {}
	$: finalAlign = textAlign === 'center' ? 'center' : $language === 'ar' ? 'right' : textAlign
</script>

{#if level === 1}
	<h1
		class="{classNames(
			fontSize || '2xl',
			textColor || '',
			finalAlign || 'left', // Replace textAlign with finalAlign in all h1-h5 elements
			fontFamily || 'boogy'
		)} {className} mb-1 md:mb-3 lg:mb-4"
	>
		{@html content}
	</h1>{/if}
{#if level === 2}
	<h2
		class="{classNames(
			fontSize || 'base',
			textColor || '',
			finalAlign || 'left', // Replace textAlign with finalAlign in all h1-h5 elements
			fontFamily || 'martina'
		)} {className} pb-1 border-b border-black mt-2 md:mt-5 mb-2 md:mb-3"
	>
		{@html content}
	</h2>
{/if}
{#if level === 3}
	<h3
		class="{classNames(
			fontSize || 'base',
			textColor || '',
			finalAlign || 'left', // Replace textAlign with finalAlign in all h1-h5 elements
			fontFamily || 'martina'
		)} {className} uppercase tracking-wider mt-2 md:mt-5 mb-2 md:mb-3"
	>
		{@html content}
	</h3>
{/if}

{#if level === 4}
	<h4
		class="{classNames(
			fontSize || 'xs',
			textColor || '',
			finalAlign || 'left', // Replace textAlign with finalAlign in all h1-h5 elements
			fontFamily || 'martina'
		)} {className} uppercase tracking-widest mb-1"
	>
		{@html content}
	</h4>
{/if}

{#if level === 5}
	<h5
		class="{classNames(
			fontSize || 'xs',
			textColor || '',
			finalAlign || 'left', // Replace textAlign with finalAlign in all h1-h5 elements
			fontFamily || 'martina'
		)} {className} uppercase tracking-widest mb-1"
	>
		{@html content}
	</h5>
{/if}
