<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreButtonAttributes } from '$lib/graphql/generated'
	import Button from '$components/atoms/Button.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let attrs = $derived(block.attributes as CoreButtonAttributes | undefined)
	let style = $derived.by(() => {
		const raw = attrs?.style
		if (!raw) return null
		try {
			return typeof raw === 'string' ? JSON.parse(raw) : raw
		} catch {
			return null
		}
	})
	let borderRadius = $derived(style?.border?.radius ?? undefined)
</script>

<Button
	label={attrs?.text ?? ''}
	url={attrs?.url ?? '/'}
	linkTarget={attrs?.linkTarget ?? undefined}
	backgroundColor={attrs?.backgroundColor ?? undefined}
	textColor={attrs?.textColor ?? undefined}
	{borderRadius}
	fontSize={attrs?.fontSize ?? undefined}
	fontFamily={attrs?.fontFamily ?? undefined}
	className={attrs?.className ?? ''}
/>
