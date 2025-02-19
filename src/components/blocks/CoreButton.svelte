<script lang="ts">
	import type { CoreButton } from '$lib/graphql/generated'
	import Button from '$components/atoms/Button.svelte'

	interface Props {
		// Expect a core/button block
		block: CoreButton
	}

	let { block }: Props = $props()
	const classNames = (fontSize: string | null, textColor: string | null | undefined) => {
		let textClasses = '',
			colorClasses = textColor ? `text-${textColor}` : ''

		switch (fontSize) {
			case 'base':
				textClasses = 'font-inter text-sm md:text-base'
				break
			case 'lg':
				textClasses = 'font-inter text-base md:text-lg'
				break
			case 'xl':
				textClasses = 'font-inter text-base md:text-lg lg:text-xl'
				break
			case '2xl':
				textClasses = 'font-inter text-xl md:text-2xl'
				break
			case null:
				textClasses = 'text-sans text-sm md:text-base'
				break
		}
		colorClasses = `text-${textColor}`

		return `${textClasses} ${colorClasses}` // Combine base classes with spacing classes
	}
</script>

<Button
	textClass={classNames(block.attributes?.fontSize ?? null, block.attributes?.textColor)}
	url={block.attributes.url}
	label={block.attributes?.text}
/>
