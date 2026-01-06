<script lang="ts">
	import type { CoreColumn } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: CoreColumn & { children?: any[] }
	}

	let { block }: Props = $props()

	// Handle vertical alignment from attributes
	const verticalAlignment = block.attributes?.verticalAlignment || 'top'

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

	const alignmentClass = getAlignmentClass(verticalAlignment)
	const customClasses = block.attributes?.className || ''
</script>

<div class="flex flex-col h-full grow {alignmentClass} {customClasses}">
	{#each block.children || [] as childBlock}
		<BlockRenderer block={childBlock} />
	{/each}
</div>
