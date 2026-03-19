<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreListItemAttributes } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: EditorBlock
		animation?: { delay?: string }
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CoreListItemAttributes | undefined)

	let content = $derived(attrs?.content ?? '')
	let attrClasses = $derived(
		classNames(
			attrs?.fontSize,
			attrs?.textColor,
			null,
			attrs?.fontFamily
		)
	)
</script>

{#if content}
	<li class={attrClasses}>
		{@html content}
	</li>
{/if}
