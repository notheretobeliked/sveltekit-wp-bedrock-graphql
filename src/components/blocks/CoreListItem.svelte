<script lang="ts">
	import type { CoreListItem } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: CoreListItem
	}

	let { block }: Props = $props()

	let content = $derived(block.attributes?.content ?? '')
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
	<li class={attrClasses}>
		{@html content}
	</li>
{/if}
