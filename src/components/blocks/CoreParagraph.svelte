<script lang="ts">
	import type { CoreParagraph } from '$lib/graphql/generated'

	export let block: CoreParagraph

	const {
		content = '',
		fontSize = 'base',
		textColor = 'black',
		align = 'left'
	} = block.attributes ?? {}

	const classNames = (fontSize: string, textColor: string, align: string) => {
		let textClasses: string = ''
		let alignClasses: string = 'text-left' // Initialize with default value
		let colorClasses: string = ''
		switch (fontSize) {
			case 'base':
				textClasses = 'font-martina text-sm md:text-base'
				break
			case 'lg':
				textClasses = 'font-martina text-base md:text-lg'
				break
			case 'xl':
				textClasses = 'font-martina text-lg md:text-xl'
				break
			case '2xl':
				textClasses = 'font-martina text-xl md:text-2xl'
				break
			case null:
				textClasses = 'font-martina text-sm md:text-base'
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

<!-- Use the class directive in Svelte to dynamically set classes -->
{#if content}
	<p class={classNames(fontSize ?? 'base', textColor ?? 'black', align ?? 'left')}>
		{@html content}
	</p>
{/if}
