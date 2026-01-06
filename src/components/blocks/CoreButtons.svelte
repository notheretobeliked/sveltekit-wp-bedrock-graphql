<script lang="ts">
	import CoreButton from '$components/blocks/CoreButton.svelte'
	import type { CoreButtonsBlock } from '$lib/types/wp-types'

	interface Props {
		block: CoreButtonsBlock
	}

	let { block }: Props = $props()

	let children = $derived(block.children || [])
	let bgColor = $derived(block.attributes?.backgroundColor ?? 'white')
	let justifyContent = $derived(block.attributes?.layout?.justifyContent ?? 'left')

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
		class={`m-auto flex ${justifyContentClass(justifyContent)} ${bgColor === 'black' ? '!text-white' : ''}`}
	>
		{#each children as buttonBlock}
			<CoreButton block={buttonBlock} />
		{/each}
	</div>
</div>
