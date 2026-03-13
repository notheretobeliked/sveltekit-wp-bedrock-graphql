<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let children = $derived(block.children ?? [])
	let heading = $derived(children.find((c) => c.type === 'CoreAccordionHeading'))
	let panel = $derived(children.find((c) => c.type === 'CoreAccordionPanel'))

	let title = $derived(heading?.attributes?.title ?? '')
	let showIcon = $derived(heading?.attributes?.showIcon ?? true)
	let fontSize = $derived(heading?.attributes?.fontSize ?? '')
	let fontFamily = $derived(heading?.attributes?.fontFamily ?? '')
	let openByDefault = $derived(panel?.attributes?.openByDefault ?? false)
	let panelChildren = $derived((panel as EditorBlock | undefined)?.children ?? [])

	let isOpen = $state(false)

	$effect(() => {
		isOpen = openByDefault
	})
	let typographyClasses = $derived(classNames(fontSize, null, null, fontFamily))
</script>

<div class="accordion">
	<button
		type="button"
		onclick={() => (isOpen = !isOpen)}
		aria-expanded={isOpen}
		class="w-full cursor-pointer list-none {typographyClasses} flex items-center justify-between gap-4 py-4 text-left"
	>
		<span>{@html title}</span>
		{#if showIcon}
			<svg
				class="shrink-0 size-5 transition-transform duration-300 {isOpen ? 'rotate-180' : ''}"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
			</svg>
		{/if}
	</button>
	<div
		class="grid transition-[grid-template-rows] duration-300 ease-in-out"
		style="grid-template-rows: {isOpen ? '1fr' : '0fr'}"
	>
		<div class="overflow-hidden">
			<div class="pb-4">
				{#each panelChildren as childBlock}
					<BlockRenderer block={childBlock} forceFull />
				{/each}
			</div>
		</div>
	</div>
</div>
