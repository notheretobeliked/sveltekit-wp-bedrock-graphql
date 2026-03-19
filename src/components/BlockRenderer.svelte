<script lang="ts">
	import type { Component } from 'svelte'
	import type { EditorBlock } from '$lib/types/wp-types'
	import { extractBlockClasses } from '$lib/utilities/block-attributes'
	import { blockReveal } from '$lib/actions/block-reveal'

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
	const blockComponents: Record<string, Component<{ block: EditorBlock; animation?: { delay?: string } }>> = {
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

	// Prose blocks render bare (no wrapper div) so they get natural spacing
	const proseTypes = new Set([
		'CoreParagraph',
		'CoreHeading',
		'CoreImage',
		'CoreList',
		'CoreListItem',
		'CoreQuote'
	])

	interface Props {
		forceFull?: boolean
		forceFullHeight?: boolean
		block: EditorBlock
		staggerIndex?: number
	}

	let { forceFull = false, forceFullHeight = false, block, staggerIndex }: Props = $props()

	// Derived values for reactivity
	let blockType = $derived(block.type ?? '')
	let component = $derived(blockComponents[blockType])
	let isProse = $derived(proseTypes.has(blockType))
	let align = $derived(
		forceFull || block.name === 'core/column' ? 'full' : (block.attributes?.align ?? 'none')
	)
	let verticalAlignment = $derived(block.attributes?.verticalAlignment ?? null)

	// Use shared utility for block classes
	let blockClasses = $derived(extractBlockClasses(block.attributes as Record<string, unknown>))

	let blockClass = $derived(block.name?.toLowerCase().replace('/', '-') ?? '')

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

	// Scroll-triggered fade-in animation
	let isTopLevel = $derived(!block.parentClientId)
	let isContainer = $derived(containerTypes.has(blockType))
	let shouldAnimate = $derived(
		(isTopLevel && !isContainer) || staggerIndex !== undefined
	)
	let staggerDelay = $derived(
		staggerIndex !== undefined ? `${staggerIndex * 0.15}s` : '0s'
	)

	// Animation prop passed to prose components
	let animation = $derived(shouldAnimate ? { delay: staggerDelay } : undefined)

	// For structural blocks, manage animation on the wrapper div
	let visible = $state(true) // start visible for SSR
	let el: HTMLDivElement

	$effect(() => {
		if (isProse || !shouldAnimate || !el) return
		if (typeof window === 'undefined') return
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

		const rect = el.getBoundingClientRect()
		if (rect.top < window.innerHeight) return

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

{#if isProse && component}
	{@const Component = component}
	<Component {block} {animation} />
{:else}
	<div
		class="{blockClass} {verticalAlignClasses} {alignClasses} {blockClasses.spacingClasses} {blockClasses.bgClasses} {blockClasses.textColorClasses} {blockClasses.className} {forceFullHeight ? 'h-full' : ''}"
		class:block-reveal={shouldAnimate}
		class:block-visible={visible}
		style:transition-delay={shouldAnimate && staggerIndex !== undefined ? staggerDelay : undefined}
		style:border-radius={blockClasses.borderRadius}
		bind:this={el}
	>
		{#if component}
			{@const Component = component}
			<Component {block} />
		{/if}
	</div>
{/if}
