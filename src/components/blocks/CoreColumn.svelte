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

	let verticalAlignment = $derived(block.attributes?.verticalAlignment || 'top')
	let alignmentClass = $derived(getAlignmentClass(verticalAlignment))
	let customClasses = $derived(block.attributes?.className || '')
	let children = $derived(block.children || [])
</script>

<div class="flex flex-col h-full grow {alignmentClass} {customClasses}">
	{#each children as childBlock}
		<BlockRenderer block={childBlock} />
	{/each}
</div>
