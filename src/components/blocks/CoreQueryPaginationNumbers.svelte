<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let paginationData = $derived(block.paginationData)

	let currentPage = $derived(paginationData?.currentPage ?? 1)
	let totalPages = $derived(paginationData?.totalPages ?? 1)
	let baseUri = $derived(paginationData?.baseUri ?? '')
	let midSize = $derived(block.attributes?.midSize ?? 2)

	let pageNumbers = $derived.by(() => {
		const pages: (number | string)[] = []

		pages.push(1)

		const rangeStart = Math.max(2, currentPage - midSize)
		const rangeEnd = Math.min(totalPages - 1, currentPage + midSize)

		if (rangeStart > 2) pages.push('...')

		for (let i = rangeStart; i <= rangeEnd; i++) {
			pages.push(i)
		}

		if (rangeEnd < totalPages - 1) pages.push('...')

		if (totalPages > 1) pages.push(totalPages)

		return pages
	})

	function getHref(page: number): string {
		return page === 1 ? baseUri : `${baseUri}/${page}`
	}
</script>

<div class="flex items-center gap-1">
	{#each pageNumbers as pageNum}
		{#if pageNum === '...'}
			<span class="px-2 py-1">…</span>
		{:else if pageNum === currentPage}
			<span
				class="px-3 py-1 bg-black text-white border border-black"
				aria-current="page"
			>
				{pageNum}
			</span>
		{:else}
			<a
				href={getHref(pageNum as number)}
				class="px-3 py-1 border border-black hover:bg-black hover:text-white transition-colors"
				aria-label="Go to page {pageNum}"
			>
				{pageNum}
			</a>
		{/if}
	{/each}
</div>
