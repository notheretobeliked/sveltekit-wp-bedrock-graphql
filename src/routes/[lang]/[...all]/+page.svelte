<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import PostsHeader from '$components/atoms/PostsHeader.svelte'
	import Button from '$components/Button.svelte'

	import type { PageData } from './$types'
	export let data: PageData
	let editorBlocks: EditorBlock[],
		uri: string,
		isLearningHubSingle: boolean = false
	let bgColour: string
	let bgColourClass: string

	$: {
		bgColour = data.data.nodeByUri?.pageDesign?.bgColour?.slug || 'white-off'
		bgColourClass = getBgColorClass(bgColour)
	}

	function getBgColorClass(color: string | null): string {
		return color ? `bg-${color}` : 'bg-white-off'
	}

	let selectedCategory: string | null = null

	// Create a reactive filtered posts array
	$: filteredPosts = selectedCategory
		? data.learningHubPosts.filter((post) => post.category === selectedCategory)
		: data.learningHubPosts

	// Handle category selection
	function handleCategorySelect(category: string | null) {
		selectedCategory = category
	}

	console.log(data)

	$: {
		;({ editorBlocks, uri, isLearningHubSingle } = data)
	}
</script>

<div class="py-24 min-h-screen {bgColourClass}">
	{#if isLearningHubSingle}
		<div class="core/paragraph w-full max-w-screen-md mx-auto !px-0">
			<PostsHeader
				byline={data.data.nodeByUri.learningHubFields.byline}
				title={data.data.nodeByUri.title}
				date={data.data.nodeByUri.date}
			/>
		</div>
	{/if}
	{#each editorBlocks as block, index (block.clientId)}
		<BlockRenderer {block} />
	{/each}
	<div class="w-full max-w-screen-md mx-auto">
		{#if data.learningHubCategories}
			<div class="flex flex-row gap-2">
				{#each data.learningHubCategories as category}
					<div class="flex-1">
						<Button
							label={category.name}
							fullWidth
							active={selectedCategory === category.name}
							on:click={() => handleCategorySelect(category.name)}
							url="#"
						/>
					</div>
				{/each}

				<div class="flex-1">
					<Button
						label="All"
						active={selectedCategory === null}
						fullWidth
						on:click={() => handleCategorySelect(null)}
						url="#"
					/>
				</div>
			</div>
		{/if}
		{#if data.learningHubPosts}
			<div class="mt-10 post-list">
				{#each filteredPosts as post}
					<PostsHeader {...post} />
				{/each}
			</div>
		{/if}
	</div>
</div>
