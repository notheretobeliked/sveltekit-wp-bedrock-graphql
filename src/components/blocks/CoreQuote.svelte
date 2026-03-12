<script lang="ts">
	import type { CoreQuote } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: CoreQuote & { children?: any[] }
	}

	let { block }: Props = $props()

	let children = $derived(block.children || [])
	let citation = $derived(block.attributes?.citation ?? '')
	let customClasses = $derived(block.attributes?.className ?? '')
	let attrClasses = $derived(
		classNames(
			block.attributes?.fontSize,
			block.attributes?.textColor,
			block.attributes?.textAlign,
			block.attributes?.fontFamily
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
