<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let level = $derived(block.attributes?.level ?? 1)
	let fontSize = $derived(block.attributes?.fontSize ?? '')
	let textColor = $derived(block.attributes?.textColor ?? '')
	let textAlign = $derived(block.attributes?.textAlign ?? '')
	let fontFamily = $derived(block.attributes?.fontFamily ?? '')
	let className = $derived(block.attributes?.className ?? '')
	let title = $derived(block.postTitle ?? block.attributes?.content ?? '')

	let classes = $derived(
		[classNames(fontSize, textColor, textAlign, fontFamily), className].filter(Boolean).join(' ')
	)
</script>

{#if level === 1}
	<h1 class="mb-0 {classes}">{@html title}</h1>
{:else if level === 2}
	<h2 class="mb-0 {classes}">{@html title}</h2>
{:else if level === 3}
	<h3 class="mb-0 {classes}">{@html title}</h3>
{:else if level === 4}
	<h4 class="mb-0 {classes}">{@html title}</h4>
{:else if level === 5}
	<h5 class="mb-0 {classes}">{@html title}</h5>
{:else if level === 6}
	<h6 class="mb-0 {classes}">{@html title}</h6>
{/if}
