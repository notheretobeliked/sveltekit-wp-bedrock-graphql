<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'

	export let block: EditorBlock
	const { content, fontSize, textColor, textAlign, level } = block.attributes

	const classNames = (fontSize: string, textColor: string, textAlign: string) => {
		let textClasses: string,
			alignClasses: string,
			colorClasses: string = ''
		switch (fontSize) {
			case 'base':
				textClasses = 'text-sm md:text-base'
				break
			case 'lg':
				textClasses = 'text-base md:text-lg'
				break
			case 'xl':
				textClasses = 'text-lg md:text-xl'
				break
			case '2xl':
				textClasses = 'text-xl md:text-2xl'
				break
			case null:
				textClasses = 'text-sm md:text-base'
				break
		}
		switch (textAlign) {
			case 'center':
				alignClasses = 'text-center'
				break
			case 'left':
				alignClasses = 'text-left'
				break
			case 'right':
				alignClasses = 'text-right'
				break
			case null:
				alignClasses = 'text-left'
				break
		}
		colorClasses = `text-${textColor}`
		if (textColor === 'nhtbl-green-base')
			colorClasses = `${colorClasses} group-hover:text-black transition-color duration-300`

		return `${textClasses} ${alignClasses} ${colorClasses}` // Combine base classes with spacing classes
	}
</script>

{#if level === 1}
	<h1 class="{classNames(fontSize, textColor, textAlign)} font-display">
		{@html content}
	</h1>
{/if}
{#if level === 2}
	<h2 class="{classNames(fontSize, textColor, textAlign)}  font-display">
		{@html content}
	</h2>
{/if}
{#if level === 3}
	<h3 class="{classNames(fontSize, textColor, textAlign)}  font-display">
		{@html content}
	</h3>
{/if}
