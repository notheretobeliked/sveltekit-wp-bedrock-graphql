<script lang="ts">
	import type { CoreColumn } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: CoreColumn & { children?: any[] }
	}

	let { block }: Props = $props()

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

	let verticalAlignment = $derived(block.attributes?.verticalAlignment || 'top')
	let alignmentClass = $derived(getAlignmentClass(verticalAlignment))
	let customClasses = $derived(block.attributes?.className || '')
	let children = $derived(block.children || [])

	let gapClass = $derived.by(() => {
		const raw = block.attributes?.style
		if (!raw) return ''
		try {
			const style = typeof raw === 'string' ? JSON.parse(raw) : raw
			const gap = style?.spacing?.blockGap
			if (!gap) return ''
			const tw = presetToSpacing(gap)
			return tw ? `gap-${tw}` : ''
		} catch {
			return ''
		}
	})
</script>

<div class="flex flex-col h-full grow min-w-0 {alignmentClass} {customClasses} {gapClass}">
	{#each children as childBlock}
		<BlockRenderer block={childBlock} />
	{/each}
</div>
