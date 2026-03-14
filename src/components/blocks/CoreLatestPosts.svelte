<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreLatestPostsAttributes } from '$lib/graphql/generated'

	interface ResolvedPostImageSize {
		sourceUrl: string
		width: string
		height: string
		name: string
		mimeType?: string
	}

	interface ResolvedPostImage {
		sourceUrl: string
		altText: string
		sizes: ResolvedPostImageSize[]
	}

	interface ResolvedPost {
		title: string
		date: string
		uri: string
		excerpt?: string
		featuredImage?: ResolvedPostImage
	}

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CoreLatestPostsAttributes | undefined)

	let posts = $derived((block.resolvedPosts ?? []) as ResolvedPost[])
	let showDate = $derived(attrs?.displayPostDate ?? false)
	let showImage = $derived(attrs?.displayFeaturedImage ?? false)

	function formatDate(dateStr: string): string {
		const date = new Date(dateStr)
		return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
	}

	function getThumbnail(image: ResolvedPostImage): string {
		const medium = image.sizes?.find((s) => s.name === 'MEDIUM')
		return medium?.sourceUrl ?? image.sourceUrl
	}
</script>

{#if posts.length > 0}
	<ul class="list-none p-0 m-0 flex flex-col gap-4 {attrs?.className ?? ''}">
		{#each posts as post}
			<li>
				<a href={post.uri} class="flex gap-4 items-start no-underline hover:opacity-75 transition-opacity duration-200">
					{#if showImage && post.featuredImage}
						<img
							src={getThumbnail(post.featuredImage)}
							alt={post.featuredImage.altText || post.title}
							class="w-16 h-16 object-cover flex-shrink-0"
							loading="lazy"
						/>
					{/if}
					<div>
						<span class="font-sans">{@html post.title}</span>
						{#if showDate && post.date}
							<span class="block text-sm opacity-50 font-sans">{formatDate(post.date)}</span>
						{/if}
					</div>
				</a>
			</li>
		{/each}
	</ul>
{/if}
