<script lang="ts">
	import type { CoreHeading } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'

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
</script>

{#if level === 1}
	<h1
		class="{classNames(
			fontSize || '2xl',
			textColor || '',
			textAlign || 'left',
			fontFamily || 'boogy'
		)} {className} mb-5"
	>
		{@html content}
	</h1>{/if}
{#if level === 2}
	<h2
		class="{classNames(
			fontSize || 'base',
			textColor || '',
			textAlign || 'left',
			fontFamily || 'martina'
		)} {className} pb-1 border-b border-black mb-3"
	>
		{@html content}
	</h2>
{/if}
{#if level === 3}
	<h3
		class="{classNames(
			fontSize || 'base',
			textColor || '',
			textAlign || 'left',
			fontFamily || 'martina'
		)} {className} uppercase tracking-wider mb-3"
	>
		{@html content}
	</h3>
{/if}

{#if level === 4}
	<h4
		class="{classNames(
			fontSize || 'xs',
			textColor || '',
			textAlign || 'left',
			fontFamily || 'martina'
		)} {className} uppercase tracking-widest mb-1"
	>
		{@html content}
	</h4>
{/if}
