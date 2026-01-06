<script lang="ts">
	import type { Component } from 'svelte'
	import type { EditorBlock } from '$lib/graphql/generated'

	// Block component imports
	import CoreButton from './blocks/CoreButton.svelte'
	import CoreButtons from './blocks/CoreButtons.svelte'
	import CoreColumn from './blocks/CoreColumn.svelte'
	import CoreColumns from './blocks/CoreColumns.svelte'
	import CoreEmbed from './blocks/CoreEmbed.svelte'
	import CoreFootnotes from './blocks/CoreFootnotes.svelte'
	import CoreGroup from './blocks/CoreGroup.svelte'
	import CoreHeading from './blocks/CoreHeading.svelte'
	import CoreImage from './blocks/CoreImage.svelte'
	import CoreList from './blocks/CoreList.svelte'
	import CoreListItem from './blocks/CoreListItem.svelte'
	import CoreParagraph from './blocks/CoreParagraph.svelte'
	import CoreSpacer from './blocks/CoreSpacer.svelte'
	import CoreVideo from './blocks/CoreVideo.svelte'

	// Component map keyed by block type (matches GraphQL `type` field)
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const blockComponents: Record<string, Component<any>> = {
		CoreButton,
		CoreButtons,
		CoreColumn,
		CoreColumns,
		CoreEmbed,
		CoreFootnotes,
		CoreGroup,
		CoreHeading,
		CoreImage,
		CoreList,
		CoreListItem,
		CoreParagraph,
		CoreSpacer,
		CoreVideo
	}

	interface Props {
		forceFull?: boolean
		block: EditorBlock
	}

	let { forceFull = false, block }: Props = $props()

	// Derived values for reactivity
	let blockType = $derived(block.type ?? '')
	let component = $derived(blockComponents[blockType])
	let align = $derived(
		forceFull || block.name === 'core/column' ? 'full' : (block.attributes?.align ?? 'none')
	)
	let verticalAlignment = $derived(block.attributes?.verticalAlignment ?? null)
	let bgColor = $derived(block.attributes?.backgroundColor ?? '')

	interface StyleObject {
		spacing?: {
			padding?: {
				top?: string
				bottom?: string
			}
		}
	}

	function mapSpacingToTailwind(styleObj: StyleObject): string {
		let classes = ''
		const topPadding = styleObj?.spacing?.padding?.top?.replace('spacing|', '')
		const bottomPadding = styleObj?.spacing?.padding?.bottom?.replace('spacing|', '')

		if (topPadding) {
			const topValue = parseInt(topPadding, 10) / 10
			classes += ` pt-${topValue}`
		}

		if (bottomPadding) {
			const bottomValue = parseInt(bottomPadding, 10) / 10
			classes += ` pb-${bottomValue}`
		}

		return classes.trim()
	}

	let spacingClasses = $derived(
		block.attributes?.style ? mapSpacingToTailwind(block.attributes.style as StyleObject) : ''
	)

	let alignClasses = $derived.by(() => {
		switch (align) {
			case 'full':
				return 'w-full max-w-full'
			case 'wide':
				return 'w-full max-w-screen-xl mx-auto'
			case 'none':
			case 'center':
				return 'w-full max-w-screen-md mx-auto'
			default:
				return 'w-full'
		}
	})

	let verticalAlignClasses = $derived.by(() => {
		switch (verticalAlignment) {
			case 'stretch':
				return 'flex items-stretch'
			case 'center':
				return 'flex items-center'
			case 'bottom':
				return 'flex items-end'
			case 'top':
				return 'flex items-start'
			default:
				return ''
		}
	})

	let bgClasses = $derived.by(() => {
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
	})

	let blockClass = $derived(block.name?.toLowerCase().replace('/', '-') ?? '')
</script>

<div class="{blockClass} {verticalAlignClasses} {alignClasses} {spacingClasses} {bgClasses} !px-0">
	{#if component}
		{@const Component = component}
		<Component {block} />
	{/if}
</div>


