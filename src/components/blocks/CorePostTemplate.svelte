<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CorePostTemplateAttributes } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CorePostTemplateAttributes | undefined)

	let resolvedPosts = $derived(block.resolvedPosts ?? [])
	let children = $derived(block.children ?? [])

	let layout = $derived.by(() => {
		const layoutAttr = attrs?.layout
		if (!layoutAttr) return { type: 'default', columnCount: 1 }
		try {
			return typeof layoutAttr === 'string' ? JSON.parse(layoutAttr) : layoutAttr
		} catch {
			return { type: 'default', columnCount: 1 }
		}
	})

	let columnCount = $derived(layout.columnCount ?? 1)
	let isGrid = $derived(layout.type === 'grid')

	let gridClasses = $derived.by(() => {
		if (!isGrid || columnCount === 1) return 'grid grid-cols-1 gap-4'
		if (columnCount === 2) return 'grid grid-cols-1 md:grid-cols-2 gap-4'
		if (columnCount === 3) return 'grid grid-cols-1 md:grid-cols-3 gap-4'
		if (columnCount === 4) return 'grid grid-cols-1 md:grid-cols-4 gap-4'
		if (columnCount === 5) return 'grid grid-cols-1 md:grid-cols-5 gap-4'
		if (columnCount === 6) return 'grid grid-cols-1 md:grid-cols-6 gap-4'
		return 'grid grid-cols-1 gap-4'
	})

	/** Recursively attach current post context onto a block and all its descendants */
	function withPostContext(childBlock: EditorBlock, post: Record<string, unknown>): EditorBlock {
		return {
			...childBlock,
			postTitle: post.title as string,
			postDate: post.date as string,
			postUri: post.uri as string,
			postFeaturedImage: post.featuredImage as Record<string, unknown>,
			children: childBlock.children?.map((child) => withPostContext(child, post))
		}
	}
</script>

<div class="{gridClasses} max-w-none">
	{#each resolvedPosts as post}
		<div class="post-item flex flex-col gap-1 md:gap-2">
			<a href={post.uri as string} class="contents cursor-pointer">
				{#each children as childBlock}
					<BlockRenderer block={withPostContext(childBlock, post)} forceFull />
				{/each}
			</a>
		</div>
	{/each}
</div>
