<script lang="ts">
	import type {
		CoreParagraph as CoreParagraphType,
		CoreHeading as CoreHeadingType,
		CoreGroup as CoreGroupType,
		CoreColumns as CoreColumnsType,
		CoreColumn as CoreColumnType,
		CoreSpacer as CoreSpacerType,
		CoreButtons as CoreButtonsType,
		CoreButton as CoreButtonType,
		CoreFootnotes as CoreFootnotesType,
		CoreEmbed as CoreEmbedType,
		CoreImage as CoreImageType,
		CoreList as CoreListType,
		CoreListItem as CoreListItemType,
		CoreVideo as CoreVideoType
	} from '$lib/graphql/generated'

	interface NormalizedBlock {
		attributes: {
			align?: string
			verticalAlignment?: string
			backgroundColor?: string
			style?: StyleObject
		}
		name: string // Add this line
	}

	type EditorBlock =
		| (CoreParagraphType & NormalizedBlock)
		| (CoreHeadingType & NormalizedBlock)
		| (CoreGroupType & NormalizedBlock)
		| (CoreColumnsType & NormalizedBlock)
		| (CoreColumnType & NormalizedBlock)
		| (CoreSpacerType & NormalizedBlock)
		| (CoreButtonsType & NormalizedBlock)
		| (CoreButtonType & NormalizedBlock)
		| (CoreFootnotesType & NormalizedBlock)
		| (CoreEmbedType & NormalizedBlock)
		| (CoreImageType & NormalizedBlock)
		| (CoreListType & NormalizedBlock)
		| (CoreListItemType & NormalizedBlock)
		| (CoreVideoType & NormalizedBlock)


	import CoreParagraph from '$components/blocks/CoreParagraph.svelte'
	import CoreFootnotes from '$components/blocks/CoreFootnotes.svelte'
	import CoreHeading from '$components/blocks/CoreHeading.svelte'
	import CoreGroup from '$components/blocks/CoreGroup.svelte'
	import CoreColumns from '$components/blocks/CoreColumns.svelte'
	import CoreColumn from '$components/blocks/CoreColumn.svelte'
	import CoreSpacer from './blocks/CoreSpacer.svelte'
	import CoreButtons from './blocks/CoreButtons.svelte'
	import CoreEmbed from './blocks/CoreEmbed.svelte'
	import CoreImage from './blocks/CoreImage.svelte'
	import CoreButton from './blocks/CoreButton.svelte'
	import CoreList from './blocks/CoreList.svelte'
	import CoreListItem from './blocks/CoreListItem.svelte'
	import CoreVideo from './blocks/CoreVideo.svelte'

	interface Props {
		/*
    this is the main component for outputting blocks.
    it ingests an editorBlocks object, and outputs the relevant Core block
    depending on what data is needed.
    
    todo: Write and extend more core blocks (see list below for included blocks)
  */
		forceFull?: boolean;
		block: EditorBlock;
	}

	let { forceFull = false, block }: Props = $props();
	let align = $state(block.attributes?.align || 'none')
	let verticalAlignment = block.attributes?.verticalAlignment ?? null

	if (forceFull || block.name === 'core/column') align = 'full'
	const bgColor = block.attributes?.backgroundColor ?? ''

	interface StyleObject {
		spacing?: {
			padding?: {
				top?: string
				bottom?: string
			}
		}
	}

	// Adjusted function to work directly with the style object
	function mapSpacingToTailwind(styleObj: StyleObject): string {
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
	const spacingClasses = block.attributes?.style
		? mapSpacingToTailwind(block.attributes.style as StyleObject)
		: ''

	const classNames = (align: string) => {
		let baseClasses = ''

		switch (align) {
			case 'full':
				baseClasses = 'w-full max-w-full '
				break
			case 'wide':
				baseClasses = 'w-full max-w-screen-xl mx-auto '
				break
			case 'none':
				baseClasses = 'w-full max-w-screen-md mx-auto '
				break
			case 'center':
				baseClasses = 'w-full max-w-screen-md mx-auto '
				break
			case null:
				baseClasses = 'w-full '
				break
		}

		return `${baseClasses} ${spacingClasses}` // Combine base classes with spacing classes
	}

	const verticalAlignmentClasses = (align: string | null) => {
		let baseClasses = ''

		switch (align) {
			case 'stretch':
				baseClasses = 'flex items-stretch'
				break
			case 'center':
				baseClasses = 'flex items-center'
				break
			case 'bottom':
				baseClasses = 'flex items-end'
				break
			case 'top':
				baseClasses = 'flex items-start'
				break
			case null:
				baseClasses = ''
				break
		}

		return baseClasses
	}

	const getBgClass = (bgColor: string | null): string => {
		switch (bgColor) {
			case 'green':
				return 'bg-green'
			case 'black':
				return 'bg-black'
			case 'yellow':
				return 'bg-yellow'
			case 'blue':
				return 'bg-blue'
			case 'red':
				return 'bg-red'
			case 'sand':
				return 'bg-sand'
			default:
				return ''
		}
	}
</script>

<div
	class="{block.name.toLowerCase().replace('/', '-')} {verticalAlignmentClasses(verticalAlignment)} {classNames(align)} {getBgClass(
		bgColor
	)} !px-0"
>
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

	{#if block.name === 'core/footnotes'}
		<CoreFootnotes {block} />
	{/if}

	{#if block.name === 'core/embed'}
		<CoreEmbed {block} />
	{/if}

	{#if block.name === 'core/image'}
		<CoreImage {block} />
	{/if}

	{#if block.name === 'core/list'}
		<CoreList {block} />
	{/if}
	{#if block.name === 'core/list-item'}
		<CoreListItem {block} />
	{/if}

	{#if block.name === 'core/video'}
		<CoreVideo {block} />
	{/if}
</div>

