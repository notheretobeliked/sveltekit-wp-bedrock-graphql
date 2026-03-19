<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreQuoteAttributes } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'
	import { extractBlockClasses } from '$lib/utilities/block-attributes'
	import { blockReveal } from '$lib/actions/block-reveal'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: EditorBlock
		animation?: { delay?: string }
	}

	let { block, animation }: Props = $props()
	let attrs = $derived(block.attributes as CoreQuoteAttributes | undefined)
	let bc = $derived(extractBlockClasses(block.attributes as Record<string, unknown>))

	let children = $derived(block.children || [])
	let citation = $derived(attrs?.citation ?? '')
	let customClasses = $derived(attrs?.className ?? '')
	let attrClasses = $derived(
		classNames(
			attrs?.fontSize,
			attrs?.textColor,
			attrs?.textAlign,
			attrs?.fontFamily
		)
	)
</script>

<blockquote
	class="{attrClasses} {customClasses} {bc.spacingClasses} {bc.bgClasses} {bc.textColorClasses}"
	style:border-radius={bc.borderRadius}
	use:blockReveal={animation}
>
	{#each children as childBlock}
		<BlockRenderer block={childBlock} forceFull />
	{/each}
	{#if citation}
		<cite class="block mt-2 text-sm font-sans not-italic">
			{@html citation}
		</cite>
	{/if}
</blockquote>
