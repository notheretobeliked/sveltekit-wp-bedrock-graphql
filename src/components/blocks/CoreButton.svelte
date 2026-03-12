<script lang="ts">
	import type { CoreButton } from '$lib/graphql/generated'
	import Button from '$components/atoms/Button.svelte'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: CoreButton
	}

	let { block }: Props = $props()

	let attrs = $derived(block.attributes)
	let style = $derived.by(() => {
		const raw = attrs?.style
		if (!raw) return null
		try {
			return typeof raw === 'string' ? JSON.parse(raw) : raw
		} catch {
			return null
		}
	})
	let borderRadius = $derived(style?.border?.radius ?? '')

	let attrClasses = $derived(
		classNames(attrs?.fontSize, null, null, null)
	)
	let url = $derived(attrs?.url ?? '')
	let label = $derived(attrs?.text ?? '')
	let bgColor = $derived(
		attrs?.backgroundColor ? `bg-${attrs.backgroundColor}` : undefined
	)
	let txtColor = $derived(
		attrs?.textColor ? `text-${attrs.textColor}` : undefined
	)
	let className = $derived(attrs?.className ?? '')
	let combinedTextClass = $derived(`${attrClasses} ${className}`.trim())
	let borderRadiusStyle = $derived(borderRadius ? `border-radius: ${borderRadius}` : '')
</script>

<span class="core-button-wrap" style={borderRadiusStyle}>
	<Button
		textClass={combinedTextClass}
		colourClass={bgColor}
		textColourClass={txtColor}
		{url}
		{label}
	/>
</span>

<style>
	.core-button-wrap :global(a) {
		border-radius: inherit;
	}
</style>
