<script lang="ts">
	import type { CoreHeading } from '$lib/graphql/generated'

	export let block: CoreHeading
	const {
		content = '',
		fontSize = 'base',
		textColor = '',
		textAlign = 'left',
		level = 1
	} = block.attributes ?? {}

	const classNames = (fontSize: string, textColor: string, align: string) => {
		let textClasses: string = ''
		let alignClasses: string = 'text-left' // Initialize with default value
		let colorClasses: string = ''
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
		switch (align) {
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
		if (textColor === 'green')
			colorClasses = `${colorClasses} group-hover:text-black transition-color`

		return `${textClasses} ${alignClasses} ${colorClasses} mb-4` // Combine base classes with spacing classes
	}
</script>

{#if level === 1}
	<h1 class="{classNames(fontSize ?? '2xl', textColor ?? '', textAlign ?? 'left')} font-boogy">
		{@html content}
	</h1>
{/if}
{#if level === 2}
	<h2 class="{classNames(fontSize ?? 'xl', textColor ?? '', textAlign ?? 'left')} font-boogy">
		{@html content}
	</h2>
{/if}
{#if level === 3}
	<h3  class="{classNames(fontSize ?? 'lg', textColor ?? '', textAlign ?? 'left')} font-boogy">
		{@html content}
	</h3>
{/if}
