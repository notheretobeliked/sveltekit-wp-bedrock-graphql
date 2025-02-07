<script lang="ts">
	import { onMount } from 'svelte'
	import type { EditorBlock } from '$lib/types/wp-types'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import PostsHeader from '$components/atoms/PostsHeader.svelte'
	import Button from '$components/Button.svelte'
	import { language } from '$stores/language'
	import { labelTranslations } from '$stores/translations'
	import type { PageData } from './$types'
	import { slide } from 'svelte/transition'
	export let data: PageData
	let editorBlocks: EditorBlock[],
		uri: string,
		isLearningHubSingle: boolean = false
	let bgColour: string
	let bgColourClass: string

	let showFullContent = false
	let visibleBlocks
	let hiddenBlocks
	let headerHeight: number
	$: {
		bgColour = data.data.nodeByUri?.pageDesign?.bgColour?.slug || 'white-off'
		bgColourClass = getBgColorClass(bgColour)
		const readMoreIndex = editorBlocks?.findIndex((block) => block.name === 'core/read-more')
		visibleBlocks = readMoreIndex === -1 ? editorBlocks : editorBlocks.slice(0, readMoreIndex)

		hiddenBlocks = readMoreIndex === -1 ? [] : editorBlocks.slice(readMoreIndex + 1)
	}

	function getBgColorClass(color: string | null): string {
		return color ? `bg-${color}` : 'bg-white-off'
	}

	function formatDate(dateString: string): string {
		const date = new Date(dateString)
		return date
			.toLocaleDateString('en-GB', {
				day: '2-digit',
				month: '2-digit',
				year: 'numeric'
			})
			.replace(/\//g, '.')
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

	let isHomePage: boolean = false

	$: {
		;({ editorBlocks, uri, isLearningHubSingle } = data)
		isHomePage = uri === '/' || uri === '/en' || uri === '/ar'
	}
	onMount(() => {
		const header = document.getElementById('top-bar')
		if (header) {
			headerHeight = header.clientHeight
		}
	})

	function handleReadMore() {
		showFullContent = !showFullContent
	}

	let isHovering = false
</script>

<div
	class="pt-24 min-h-screen {bgColourClass} {isHomePage ? 'homepage' : ''}"
	style={isHomePage
		? `padding-top:
    ${headerHeight}px; padding-bottom:0`
		: ''}
>
	{#if isLearningHubSingle}
		<div class="w-full max-w-screen-md mx-auto !px-0">
			<div class="w-full mb-3 h-5 flex content-center">
				<div 
					class="w-full mb-3"
					on:mouseenter={() => isHovering = true}
					on:mouseleave={() => isHovering = false}
				>
					{#if !isHovering}
						<a
							transition:slide
							class="{$language === 'en' ? 'font-martina ' : 'font-lyon'} text-base text-center w-full block mb-3"
							href="/{data.lang}/{data.learningHubSlug}"
						>
							{$labelTranslations.learninghub[$language]}
						</a>
					{:else}
						<a
							transition:slide
							class="{$language === 'en' ? 'font-martina ' : 'font-lyon'} text-base text-center w-full block mb-3"
							href="/{data.lang}/{data.learningHubSlug}"
						>
							{$labelTranslations.backtolearninghub[$language]}
						</a>
					{/if}
				</div>
			</div>
			<PostsHeader
				byline={data.data.nodeByUri.learningHubFields.byline}
				title={data.data.nodeByUri.title}
				date={formatDate(data.data.nodeByUri.date)}
			/>
		</div>
	{/if}

	{#each editorBlocks as block, index (block.clientId)}
		<BlockRenderer {block} />
	{/each}

	<div class="w-full max-w-screen-md mx-auto">
		{#if data.learningHubCategories}
			<div class="px-2 md:px-0 flex flex-row gap-2">
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

<style>
	:global(.corecolumns) {
		direction: inherit;
	}

	:global(:where(.homepage) .corecolumns) {
		direction: ltr !important;
	}
</style>
