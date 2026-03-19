<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreHeadingAttributes } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'
	import { extractBlockClasses } from '$lib/utilities/block-attributes'
	import { blockReveal } from '$lib/actions/block-reveal'

	interface Props {
		block: EditorBlock
		animation?: { delay?: string }
	}

	let { block, animation }: Props = $props()
	let attrs = $derived(block.attributes as CoreHeadingAttributes | undefined)
	let bc = $derived(extractBlockClasses(block.attributes as Record<string, unknown>))

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

	let allClasses = $derived(
		`${attrClasses} ${customClassName} ${bc.spacingClasses} ${bc.bgClasses} ${bc.textColorClasses} ${bc.alignClasses}`
	)
</script>

{#if level === 1}
	<h1 class={allClasses} style:border-radius={bc.borderRadius} use:blockReveal={animation}>
		{@html content}
	</h1>
{:else if level === 2}
	<h2 class={allClasses} style:border-radius={bc.borderRadius} use:blockReveal={animation}>
		{@html content}
	</h2>
{:else if level === 3}
	<h3 class={allClasses} style:border-radius={bc.borderRadius} use:blockReveal={animation}>
		{@html content}
	</h3>
{:else if level === 4}
	<h4 class={allClasses} style:border-radius={bc.borderRadius} use:blockReveal={animation}>
		{@html content}
	</h4>
{:else if level === 5}
	<h5 class={allClasses} style:border-radius={bc.borderRadius} use:blockReveal={animation}>
		{@html content}
	</h5>
{:else}
	<h6 class={allClasses} style:border-radius={bc.borderRadius} use:blockReveal={animation}>
		{@html content}
	</h6>
{/if}
