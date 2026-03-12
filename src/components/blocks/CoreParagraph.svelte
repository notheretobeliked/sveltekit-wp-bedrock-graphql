<script lang="ts">
	import type { CoreParagraph } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: CoreParagraph
	}

	let { block }: Props = $props()

	let content = $derived(block.attributes?.content ?? '')
	let className = $derived(block.attributes?.className ?? '')

	// Map WordPress has-text-align-* classes to Tailwind
	let textAlignClass = $derived(
		className.includes('has-text-align-center')
			? 'text-center'
			: className.includes('has-text-align-right')
				? 'text-right'
				: className.includes('has-text-align-left')
					? 'text-left'
					: ''
	)

	// Remove WordPress alignment classes since we're converting them
	let filteredClassName = $derived(
		className
			.replace(/has-text-align-(center|right|left)/g, '')
			.trim()
	)

	let attrClasses = $derived(
		classNames(
			block.attributes?.fontSize,
			block.attributes?.textColor,
			null,
			block.attributes?.fontFamily
		)
	)
</script>

{#if content}
	<p class="{attrClasses} {textAlignClass} {filteredClassName}">
		{@html content}
	</p>
{/if}
