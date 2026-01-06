<script lang="ts">
	import type { CoreHeading } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: CoreHeading
	}

	let { block }: Props = $props()

	let content = $derived(block.attributes?.content ?? '')
	let level = $derived(block.attributes?.level ?? 2)
	let customClassName = $derived(block.attributes?.className ?? '')
	let attrClasses = $derived(
		classNames(
			block.attributes?.fontSize,
			block.attributes?.textColor,
			block.attributes?.textAlign,
			block.attributes?.fontFamily
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
