<script lang="ts">
	import type { CoreButton } from '$lib/graphql/generated'
	import Button from '$components/atoms/Button.svelte'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: CoreButton
	}

	let { block }: Props = $props()

	let attrClasses = $derived(
		classNames(block.attributes?.fontSize, block.attributes?.textColor, null, null)
	)
	let url = $derived(block.attributes?.url ?? '')
	let label = $derived(block.attributes?.text ?? '')
</script>

<Button textClass={attrClasses} {url} {label} />
