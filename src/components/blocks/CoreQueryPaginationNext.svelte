<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let paginationData = $derived(block.paginationData)

	let label = $derived(block.attributes?.label ?? 'Next')
	let currentPage = $derived(paginationData?.currentPage ?? 1)
	let totalPages = $derived(paginationData?.totalPages ?? 1)
	let baseUri = $derived(paginationData?.baseUri ?? '')
	let hasNext = $derived(currentPage < totalPages)
	let nextPage = $derived(currentPage + 1)
	let href = $derived(`${baseUri}/${nextPage}`)
</script>

{#if hasNext}
	<a
		{href}
		class="px-3 py-1 border border-black hover:bg-black hover:text-white transition-colors"
		aria-label="Go to next page"
	>
		{label}
	</a>
{:else}
	<span class="px-3 py-1 border border-gray-300 text-gray-300 cursor-not-allowed">
		{label}
	</span>
{/if}
