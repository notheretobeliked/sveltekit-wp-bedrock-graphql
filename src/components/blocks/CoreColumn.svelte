<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreColumnAttributes } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CoreColumnAttributes | undefined)

	// Map vertical alignment to CSS classes
	const getAlignmentClass = (alignment: string) => {
		switch (alignment) {
			case 'top':
				return 'self-start'
			case 'center':
				return 'self-center justify-center'
			case 'bottom':
				return 'self-end justify-end'
			case 'stretch':
				return 'self-stretch'
			default:
				return 'self-start'
		}
	}

	function presetToSpacing(value: string): string | null {
		const match = value.match(/(?:var:preset\|)?spacing\|(\d+)/)
		if (match) return String(parseInt(match[1], 10) / 10)
		return null
	}

	let verticalAlignment = $derived(attrs?.verticalAlignment || 'top')
	let alignmentClass = $derived(getAlignmentClass(verticalAlignment))
	let customClasses = $derived(attrs?.className || '')
	let children = $derived(block.children || [])

	let spacingClasses = $derived.by(() => {
		const raw = attrs?.style
		if (!raw) return { gap: '', padding: '' }
		try {
			const style = typeof raw === 'string' ? JSON.parse(raw) : raw
			const spacing = style?.spacing

			let gap = ''
			if (spacing?.blockGap) {
				const tw = presetToSpacing(spacing.blockGap)
				if (tw) gap = `gap-${tw}`
			}

			const paddingClasses: string[] = []
			const padding = spacing?.padding
			if (padding) {
				const sides = [
					['top', 'pt'],
					['right', 'pr'],
					['bottom', 'pb'],
					['left', 'pl']
				] as const
				for (const [side, prefix] of sides) {
					const val = padding[side]
					if (val) {
						const tw = presetToSpacing(val)
						if (tw) paddingClasses.push(`${prefix}-${tw}`)
					}
				}
			}

			return { gap, padding: paddingClasses.join(' ') }
		} catch {
			return { gap: '', padding: '' }
		}
	})
</script>

<div class="flex flex-col h-full grow min-w-0 {alignmentClass} {customClasses} {spacingClasses.gap} {spacingClasses.padding}">
	{#each children as childBlock}
		<BlockRenderer block={childBlock} />
	{/each}
</div>
