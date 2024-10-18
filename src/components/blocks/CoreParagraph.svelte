<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'

	export let block: EditorBlock

	const { content, fontSize, textColor, align } = block.attributes

	const classNames = (fontSize: string, textColor: string, align: string) => {
		let textClasses: string,
			alignClasses: string,
			colorClasses: string = ''
		switch (fontSize) {
			case 'base':
				textClasses = 'text-sans text-sm md:text-base'
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
				textClasses = 'text-sans text-sm md:text-base'
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
<p class={classNames(fontSize, textColor, align)}>
	{@html content}
</p>
