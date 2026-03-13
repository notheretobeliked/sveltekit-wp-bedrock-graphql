<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let paginationData = $derived(block.paginationData)

	let label = $derived(block.attributes?.label ?? 'Previous')
	let currentPage = $derived(paginationData?.currentPage ?? 1)
	let baseUri = $derived(paginationData?.baseUri ?? '')
	let hasPrevious = $derived(currentPage > 1)
	let previousPage = $derived(currentPage - 1)
	let href = $derived(previousPage === 1 ? baseUri : `${baseUri}/${previousPage}`)
</script>

{#if hasPrevious}
	<a
		{href}
		class="px-3 py-1 border border-black hover:bg-black hover:text-white transition-colors"
		aria-label="Go to previous page"
	>
		{label}
	</a>
{:else}
	<span class="px-3 py-1 border border-gray-300 text-gray-300 cursor-not-allowed">
		{label}
	</span>
{/if}
