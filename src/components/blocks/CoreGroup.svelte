<script lang="ts">
	import type { CoreGroup } from '$lib/graphql/generated'
	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: CoreGroup & { children?: EditorBlock[] }
	}

	let { block }: Props = $props()

	let children = $derived(block.children || [])

	function presetToSpacing(value: string): string | null {
		const match = value.match(/(?:var:preset\|)?spacing\|(\d+)/)
		if (match) return String(parseInt(match[1], 10) / 10)
		return null
	}

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

	let layoutType = $derived.by(() => {
		const raw = block.attributes?.layout
		if (!raw) return null
		try {
			const layout = typeof raw === 'string' ? JSON.parse(raw) : raw
			return layout?.type ?? null
		} catch {
			return null
		}
	})

	let childForceFull = $derived(layoutType === 'default')
</script>

<div class="flex flex-col {gapClass}">
	{#each children as childBlock, i}
		<BlockRenderer block={childBlock} forceFull={childForceFull} staggerIndex={i} />
	{/each}
</div>
