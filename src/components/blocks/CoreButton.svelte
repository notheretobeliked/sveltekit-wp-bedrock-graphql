<script lang="ts">
	import type { CoreButton } from '$lib/graphql/generated'
	import Button from '$components/atoms/Button.svelte'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: CoreButton
	}

	let { block }: Props = $props()

	let attrClasses = $derived(
		classNames(block.attributes?.fontSize, null, null, null)
	)
	let url = $derived(block.attributes?.url ?? '')
	let label = $derived(block.attributes?.text ?? '')
	let bgColor = $derived(
		block.attributes?.backgroundColor ? `bg-${block.attributes.backgroundColor}` : undefined
	)
	let txtColor = $derived(
		block.attributes?.textColor ? `text-${block.attributes.textColor}` : undefined
	)
</script>

<Button textClass={attrClasses} colourClass={bgColor} textColourClass={txtColor} {url} {label} />
