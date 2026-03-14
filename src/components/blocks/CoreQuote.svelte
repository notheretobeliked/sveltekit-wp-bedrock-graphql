<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreQuoteAttributes } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CoreQuoteAttributes | undefined)

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

<blockquote class="{attrClasses} {customClasses}">
	{#each children as childBlock}
		<BlockRenderer block={childBlock} forceFull />
	{/each}
	{#if citation}
		<cite class="block mt-2 text-sm font-sans not-italic">
			{@html citation}
		</cite>
	{/if}
</blockquote>
