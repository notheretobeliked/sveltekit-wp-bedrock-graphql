<script lang="ts">
	import type { CoreParagraph } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: CoreParagraph
	}

	let { block }: Props = $props()

	let content = $derived(block.attributes?.content ?? '')
	let attrClasses = $derived(
		classNames(
			block.attributes?.fontSize,
			block.attributes?.textColor,
			block.attributes?.align,
			block.attributes?.fontFamily
		)
	)
</script>

{#if content}
	<p class={attrClasses}>
		{@html content}
	</p>
{/if}
