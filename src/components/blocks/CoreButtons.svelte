<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreButtonsAttributes } from '$lib/graphql/generated'
	import CoreButton from '$components/blocks/CoreButton.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CoreButtonsAttributes | undefined)

	let children = $derived(block.children || [])
	let justifyContent = $derived(
		(attrs?.layout as { justifyContent?: string } | null)?.justifyContent ?? 'left'
	)

	// Utility to generate CSS classes based on justifyContent value
	function justifyContentClass(
		value: 'space-between' | 'left' | 'right' | 'center' | string
	): string {
		switch (value) {
			case 'left':
				return 'justify-start'
			case 'center':
				return 'justify-center'
			case 'right':
				return 'justify-end'
			case 'space-between':
				return 'justify-between'
			default:
				return ''
		}
	}
</script>

<div class="px-2 md:px-0">
	<div
		class={`m-auto flex ${justifyContentClass(justifyContent)}`}
	>
		{#each children as buttonBlock}
			<CoreButton block={buttonBlock} />
		{/each}
	</div>
</div>
