<script lang="ts">
	import type { CoreHeading } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: CoreHeading;
	}

	let { block }: Props = $props();
	const {
		content = '',
		fontSize = 'base',
		textColor = '',
		textAlign = 'left',
		level = 1,
		fontFamily = 'inter',
		className = ''
	} = block.attributes ?? {}

</script>

{#if level === 1}
	<h1
		class="{classNames(
			fontSize || '2xl',
			textColor || '',
			textAlign || 'left', 
			fontFamily || 'boogy',
		)} {className} mb-1 md:mb-3 lg:mb-4 mx-2 lg:mx-0"
	>
		{@html content}
	</h1>{/if}
{#if level === 2}
	<h2
		class="{classNames(
			fontSize || 'base',
			textColor || '',
			textAlign || 'left', 
			fontFamily || 'inter',
		)} {className} pb-1 border-b border-black mt-2 md:mt-5 mb-2 md:mb-3 mx-2 lg:mx-0"
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
			fontFamily || 'inter',
		)} {className} tracking-wider uppercase mt-2 md:mt-5 mb-2 md:mb-3 mx-2 lg:mx-0"
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
			fontFamily || 'inter',
		)} {className} tracking-widest uppercase mb-1 mx-2 lg:mx-0"
	>
		{@html content}
	</h4>
{/if}

{#if level === 5}
	<h5
		class="{classNames(
			fontSize || 'xs',
			textColor || '',
			textAlign || 'left', 			
			fontFamily || 'inter',
		)} {className} tracking-widest uppercase mb-3 mx-2 lg:mx-0"
	>
		{@html content}
	</h5>
{/if}
