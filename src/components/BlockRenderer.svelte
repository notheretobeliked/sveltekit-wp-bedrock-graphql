<script lang="ts">
	/*
    this is the main component for outputting blocks.
    it ingests an editorBlocks object, and outputs the relevant Core block
    depending on what data is needed.
    
    todo: Write and extend more core blocks (see list below for included blocks)
  */
	export let forceFull: boolean = false

	let isInView: boolean

	const handleChange = ({ detail }: CustomEvent<ObserverEventDetails>) => {
		isInView = detail.inView
	}

	import type { EditorBlock } from '$lib/types/wp-types'

	import CoreParagraph from '$components/blocks/CoreParagraph.svelte'
	import CoreHeading from '$components/blocks/CoreHeading.svelte'
	import CoreGroup from '$components/blocks/CoreGroup.svelte'
	import CoreColumns from '$components/blocks/CoreColumns.svelte'
	import CoreColumn from '$components/blocks/CoreColumn.svelte'
	import CoreSpacer from './blocks/CoreSpacer.svelte'
	import CoreButtons from './blocks/CoreButtons.svelte'
	import CoreButton from './blocks/CoreButton.svelte'

	export let block: EditorBlock

	let align = block.attributes.align || 'none'
	if (forceFull) align = 'full'
	const bgColor = block.attributes.backgroundColor ?? 'white'

	// Adjusted function to work directly with the style object
	function mapSpacingToTailwind(styleObj): string {
		let classes = ''
		const topPadding = styleObj?.spacing?.padding?.top?.replace('spacing|', '')
		const bottomPadding = styleObj?.spacing?.padding?.bottom?.replace('spacing|', '')

		if (topPadding) {
			const topValue = parseInt(topPadding, 10) / 10 // Convert "20" to 2, "30" to 3, etc.
			classes += ` pt-${topValue}` // Append the Tailwind class for top padding
		}

		if (bottomPadding) {
			const bottomValue = parseInt(bottomPadding, 10) / 10 // Similar conversion for bottom
			classes += ` pb-${bottomValue}` // Append the Tailwind class for bottom padding
		}

		return classes.trim()
	}

	// Use the style object directly if it exists
	const spacingClasses = block.attributes.style ? mapSpacingToTailwind(block.attributes.style) : ''

	const classNames = (align) => {
		let baseClasses = ''
		switch (align) {
			case 'full':
				baseClasses = 'w-full max-w-full'
				break
			case 'wide':
				baseClasses = 'w-full max-w-[980px] mx-auto'
				break
			case 'none':
				baseClasses = 'w-full max-w-[852px] mx-auto'
				break
			case 'center':
				baseClasses = 'w-full max-w-[852px] mx-auto'
				break
			case null:
				baseClasses = 'w-full'
				break
		}
		return `${baseClasses} ${spacingClasses}` // Combine base classes with spacing classes
	}
</script>

<div class="{classNames(align)} bg-{bgColor} !px-0">
	{#if block.name === 'core/group'}
		<CoreGroup {block} />
	{/if}

	{#if block.name === 'core/buttons'}
		<CoreButtons {block} />
	{/if}

	{#if block.name === 'core/button'}
		<CoreButton {block} />
	{/if}

	{#if block.name === 'core/columns'}
		<CoreColumns {block} />
	{/if}

	{#if block.name === 'core/column'}
		<CoreColumn {block} />
	{/if}

	{#if block.name === 'core/paragraph'}
		<CoreParagraph {block} />
	{/if}

	{#if block.name === 'core/heading'}
		<CoreHeading {block} />
	{/if}

	{#if block.name === 'core/spacer'}
		<CoreSpacer {block} />
	{/if}
</div>
