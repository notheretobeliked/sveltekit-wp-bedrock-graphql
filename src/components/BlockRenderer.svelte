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
	import CoreQuote from './blocks/CoreQuote.svelte'
	import CoreSpacer from './blocks/CoreSpacer.svelte'
	import CoreLatestPosts from './blocks/CoreLatestPosts.svelte'
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
		CoreLatestPosts,
		CoreList,
		CoreListItem,
		CoreParagraph,
		CoreQuote,
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
	let textColor = $derived(block.attributes?.textColor ?? '')

	/**
	 * Extracts a Tailwind spacing value from a WordPress preset string.
	 * After server normalization, format is "spacing|50" → 5 (50 / 10).
	 * Also handles raw "var:preset|spacing|50" as a fallback.
	 */
	function presetToSpacing(value: string): string | null {
		const match = value.match(/(?:var:preset\|)?spacing\|(\d+)/)
		if (match) return String(parseInt(match[1], 10) / 10)
		return null
	}

	let spacingClasses = $derived.by(() => {
		const raw = block.attributes?.style
		if (!raw) return ''

		try {
			const style = typeof raw === 'string' ? JSON.parse(raw) : raw
			const padding = style?.spacing?.padding
			if (!padding) return ''

			const classes: string[] = []
			const sides = [
				['top', 'pt'],
				['right', 'pr'],
				['bottom', 'pb'],
				['left', 'pl']
			] as const

			for (const [side, prefix] of sides) {
				const val = padding[side]
				if (val) {
					const tw = presetToSpacing(val)
					if (tw) classes.push(`${prefix}-${tw}`)
				}
			}

			return classes.join(' ')
		} catch {
			return ''
		}
	})

	let alignClasses = $derived.by(() => {
		switch (align) {
			case 'full':
				return 'w-full max-w-full'
			case 'wide':
				return 'w-full max-w-screen-xl mx-auto'
			case 'none':
			case 'center':
				return 'w-full max-w-[1320px] mx-auto'
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

	let bgClasses = $derived(bgColor ? `bg-${bgColor}` : '')
	let textClasses = $derived(textColor ? `text-${textColor}` : '')

	let blockClass = $derived(block.name?.toLowerCase().replace('/', '-') ?? '')
</script>

<div class="{blockClass} {verticalAlignClasses} {alignClasses} {spacingClasses} {bgClasses} {textClasses}">
	{#if component}
		{@const Component = component}
		<Component {block} />
	{/if}
</div>


