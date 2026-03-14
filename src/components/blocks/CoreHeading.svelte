<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreHeadingAttributes } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CoreHeadingAttributes | undefined)

	let content = $derived(attrs?.content ?? '')
	let level = $derived(attrs?.level ?? 2)
	let customClassName = $derived(attrs?.className ?? '')
	let attrClasses = $derived(
		classNames(
			attrs?.fontSize,
			attrs?.textColor,
			attrs?.textAlign,
			attrs?.fontFamily
		)
	)
</script>

{#if level === 1}
	<h1 class="{attrClasses} {customClassName}">
		{@html content}
	</h1>
{:else if level === 2}
	<h2 class="{attrClasses} {customClassName}">
		{@html content}
	</h2>
{:else if level === 3}
	<h3 class="{attrClasses} {customClassName}">
		{@html content}
	</h3>
{:else if level === 4}
	<h4 class="{attrClasses} {customClassName}">
		{@html content}
	</h4>
{:else if level === 5}
	<h5 class="{attrClasses} {customClassName}">
		{@html content}
	</h5>
{:else}
	<h6 class="{attrClasses} {customClassName}">
		{@html content}
	</h6>
{/if}
