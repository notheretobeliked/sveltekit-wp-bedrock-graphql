<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreListAttributes } from '$lib/graphql/generated'
	import { extractBlockClasses } from '$lib/utilities/block-attributes'
	import { blockReveal } from '$lib/actions/block-reveal'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: EditorBlock
		animation?: { delay?: string }
	}

	let { block, animation }: Props = $props()
	let attrs = $derived(block.attributes as CoreListAttributes | undefined)
	let bc = $derived(extractBlockClasses(block.attributes as Record<string, unknown>))

	let isOrdered = $derived(attrs?.ordered)
	let children = $derived(block.children || [])
</script>

{#if isOrdered}
	<ol
		class="list-decimal list-outside {bc.spacingClasses} {bc.bgClasses} {bc.textColorClasses} {bc.className}"
		style:border-radius={bc.borderRadius}
		use:blockReveal={animation}
	>
		{#each children as childBlock}
			<BlockRenderer block={childBlock} />
		{/each}
	</ol>
{:else}
	<ul
		class="list-disc list-outside {bc.spacingClasses} {bc.bgClasses} {bc.textColorClasses} {bc.className}"
		style:border-radius={bc.borderRadius}
		use:blockReveal={animation}
	>
		{#each children as childBlock}
			<BlockRenderer block={childBlock} />
		{/each}
	</ul>
{/if}
