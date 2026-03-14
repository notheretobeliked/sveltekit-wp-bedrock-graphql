<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CorePostTitleAttributes } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CorePostTitleAttributes | undefined)

	let level = $derived(attrs?.level ?? 1)
	let fontSize = $derived(attrs?.fontSize ?? '')
	let textColor = $derived(attrs?.textColor ?? '')
	let textAlign = $derived(attrs?.textAlign ?? '')
	let fontFamily = $derived(attrs?.fontFamily ?? '')
	let className = $derived(attrs?.className ?? '')
	let title = $derived(block.postTitle ?? (block.attributes as Record<string, unknown>)?.content as string ?? '')

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
