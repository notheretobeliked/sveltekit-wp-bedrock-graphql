<script lang="ts">
	import type { Component } from 'svelte'
	import type { EditorBlock } from '$lib/types/wp-types'

	// Block component imports
	import CoreButton from './blocks/CoreButton.svelte'
	import CoreButtons from './blocks/CoreButtons.svelte'
	import CoreColumn from './blocks/CoreColumn.svelte'
	import CoreColumns from './blocks/CoreColumns.svelte'
	import CoreCover from './blocks/CoreCover.svelte'
	import CoreEmbed from './blocks/CoreEmbed.svelte'
	import CoreFootnotes from './blocks/CoreFootnotes.svelte'
	import CoreGroup from './blocks/CoreGroup.svelte'
	import CoreHeading from './blocks/CoreHeading.svelte'
	import CoreHtml from './blocks/CoreHtml.svelte'
	import CoreImage from './blocks/CoreImage.svelte'
	import CoreList from './blocks/CoreList.svelte'
	import CoreListItem from './blocks/CoreListItem.svelte'
	import CoreLatestPosts from './blocks/CoreLatestPosts.svelte'
	import CoreParagraph from './blocks/CoreParagraph.svelte'
	import CoreQuote from './blocks/CoreQuote.svelte'
	import CoreSpacer from './blocks/CoreSpacer.svelte'
	import CoreVideo from './blocks/CoreVideo.svelte'
	import CoreAccordion from './blocks/CoreAccordion.svelte'
	import CoreAccordionItem from './blocks/CoreAccordionItem.svelte'
	import CoreQuery from './blocks/CoreQuery.svelte'
	import CorePostTemplate from './blocks/CorePostTemplate.svelte'
	import CorePostTitle from './blocks/CorePostTitle.svelte'
	import CorePostDate from './blocks/CorePostDate.svelte'
	import CorePostFeaturedImage from './blocks/CorePostFeaturedImage.svelte'
	import CoreQueryNoResults from './blocks/CoreQueryNoResults.svelte'
	import CoreQueryPagination from './blocks/CoreQueryPagination.svelte'
	import CoreQueryPaginationPrevious from './blocks/CoreQueryPaginationPrevious.svelte'
	import CoreQueryPaginationNumbers from './blocks/CoreQueryPaginationNumbers.svelte'
	import CoreQueryPaginationNext from './blocks/CoreQueryPaginationNext.svelte'

	// Component map keyed by block type (matches GraphQL `type` field)
	const blockComponents: Record<string, Component<{ block: EditorBlock }>> = {
		CoreAccordion,
		CoreAccordionItem,
		CoreButton,
		CoreButtons,
		CoreColumn,
		CoreColumns,
		CoreCover,
		CoreEmbed,
		CoreFootnotes,
		CoreGroup,
		CoreHeading,
		CoreHtml,
		CoreImage,
		CoreLatestPosts,
		CoreList,
		CoreListItem,
		CoreParagraph,
		CorePostDate,
		CorePostFeaturedImage,
		CorePostTemplate,
		CorePostTitle,
		CoreQuery,
		CoreQueryNoResults,
		CoreQueryPagination,
		CoreQueryPaginationNext,
		CoreQueryPaginationNumbers,
		CoreQueryPaginationPrevious,
		CoreQuote,
		CoreSpacer,
		CoreVideo
	}

	// Block types that are layout containers — they skip their own animation
	// and instead their children animate in with stagger.
	const containerTypes = new Set(['CoreColumns', 'CoreGroup'])

	interface Props {
		forceFull?: boolean
		block: EditorBlock
		staggerIndex?: number
	}

	let { forceFull = false, block, staggerIndex }: Props = $props()

	// Derived values for reactivity
	let blockType = $derived(block.type ?? '')
	let component = $derived(blockComponents[blockType])
	let align = $derived(
		forceFull || block.name === 'core/column' ? 'full' : (block.attributes?.align ?? 'none')
	)
	let verticalAlignment = $derived(block.attributes?.verticalAlignment ?? null)
	let bgColor = $derived(block.attributes?.backgroundColor ?? '')
	let textColor = $derived(block.attributes?.textColor ?? '')
	let className = $derived(block.attributes?.className ?? '')

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
			const spacing = style?.spacing
			if (!spacing) return ''

			const classes: string[] = []

			// Padding
			const padding = spacing.padding
			if (padding) {
				const paddingSides = [
					['top', 'pt'],
					['right', 'pr'],
					['bottom', 'pb'],
					['left', 'pl']
				] as const
				for (const [side, prefix] of paddingSides) {
					const val = padding[side]
					if (val) {
						const tw = presetToSpacing(val)
						if (tw) classes.push(`${prefix}-${tw}`)
					}
				}
			}

			// Margin
			const margin = spacing.margin
			if (margin) {
				const marginSides = [
					['top', 'mt'],
					['right', 'mr'],
					['bottom', 'mb'],
					['left', 'ml']
				] as const
				for (const [side, prefix] of marginSides) {
					const val = margin[side]
					if (val) {
						const tw = presetToSpacing(val)
						if (tw) classes.push(`${prefix}-${tw}`)
					}
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
				return 'alignfull w-full max-w-full'
			case 'wide':
				return 'alignwide w-full max-w-screen-xl mx-auto'
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

	// Border radius from block style attributes
	let borderRadius = $derived.by(() => {
		const raw = block.attributes?.style
		if (!raw) return undefined
		try {
			const style = typeof raw === 'string' ? JSON.parse(raw) : raw
			return style?.border?.radius ?? undefined
		} catch {
			return undefined
		}
	})

	// Scroll-triggered fade-in animation
	let isTopLevel = $derived(!block.parentClientId)
	let isContainer = $derived(containerTypes.has(blockType))
	let shouldAnimate = $derived(
		(isTopLevel && !isContainer) || staggerIndex !== undefined
	)
	let staggerDelay = $derived(
		staggerIndex !== undefined ? `${staggerIndex * 0.15}s` : '0s'
	)
	let visible = $state(true) // start visible for SSR
	let el: HTMLDivElement

	$effect(() => {
		if (!shouldAnimate || !el) return
		if (typeof window === 'undefined') return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		// Check if already in viewport — if so, keep visible
		const rect = el.getBoundingClientRect()
		if (rect.top < window.innerHeight) return

		// Below the fold: start hidden, animate in on scroll
		visible = false
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					visible = true
					observer.disconnect()
				}
			},
			{ threshold: 0.1 }
		)
		observer.observe(el)
		return () => observer.disconnect()
	})
</script>

<div
	class="{blockClass} {verticalAlignClasses} {alignClasses} {spacingClasses} {bgClasses} {textClasses} {className}"
	class:block-reveal={shouldAnimate}
	class:block-visible={visible}
	style:transition-delay={shouldAnimate && staggerIndex !== undefined ? staggerDelay : undefined}
	style:border-radius={borderRadius}
	bind:this={el}
>
	{#if component}
		{@const Component = component}
		<Component {block} />
	{/if}
</div>

<style>
	.block-reveal {
		opacity: 0;
		transform: translateY(12px);
		transition: opacity 0.5s ease, transform 0.5s ease;
	}
	.block-reveal.block-visible {
		opacity: 1;
		transform: translateY(0);
	}
	@media (prefers-reduced-motion: reduce) {
		.block-reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
