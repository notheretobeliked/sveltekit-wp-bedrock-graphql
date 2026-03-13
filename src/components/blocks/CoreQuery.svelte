<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let resolvedPosts = $derived(block.resolvedPosts ?? [])
	let children = $derived(block.children ?? [])

	let postTemplate = $derived(children.find((child) => child.name === 'core/post-template'))
	let pagination = $derived(children.find((child) => child.name === 'core/query-pagination'))
	let noResults = $derived(children.find((child) => child.name === 'core/query-no-results'))

	let hasResults = $derived(resolvedPosts.length > 0)
	let paginationData = $derived(block.paginationData)

	/** Attach resolvedPosts onto the post-template block so it can iterate */
	let postTemplateWithPosts = $derived(
		postTemplate ? { ...postTemplate, resolvedPosts } as EditorBlock : undefined
	)

	/** Attach paginationData onto the pagination block */
	let paginationWithData = $derived(
		pagination && paginationData ? { ...pagination, paginationData } as EditorBlock : undefined
	)
</script>

{#if hasResults && postTemplateWithPosts}
	<BlockRenderer block={postTemplateWithPosts} forceFull />
{:else if !hasResults && noResults}
	<BlockRenderer block={noResults} forceFull />
{/if}

{#if paginationWithData && paginationData && paginationData.totalPages > 1}
	<BlockRenderer block={paginationWithData} forceFull />
{/if}
