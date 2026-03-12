<script lang="ts">
	import type { CoreGroup } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: CoreGroup & { children?: any[] }
	}

	let { block }: Props = $props()

	let children = $derived(block.children || [])
	let align = $derived(block.attributes?.align)

	function presetToSpacing(value: string): string | null {
		const match = value.match(/(?:var:preset\|)?spacing\|(\d+)/)
		if (match) return String(parseInt(match[1], 10) / 10)
		return null
	}

	let alignClass = $derived(
		align === 'wide'
			? 'alignwide'
			: align === 'full'
				? 'w-screen relative left-1/2 -translate-x-1/2'
				: align === 'center'
					? 'self-center'
					: align === 'left'
						? 'self-start'
						: align === 'right'
							? 'self-end'
							: ''
	)

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

<div class="px-2 md:px-0 {alignClass}">
	<div class="flex flex-col {gapClass} m-auto">
		{#each children as childBlock}
			<BlockRenderer block={childBlock} />
		{/each}
	</div>
</div>
