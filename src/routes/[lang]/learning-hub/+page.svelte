<script lang="ts">
	import type { PageData } from './$types'
	import Button from '$components/Button.svelte'
	export let data: PageData

	let selectedCategory: string | null = null

	// Create a reactive filtered posts array
	$: filteredPosts = selectedCategory
		? data.posts.filter((post) => post.category === selectedCategory)
		: data.posts

	// Handle category selection
	function handleCategorySelect(category: string | null) {
		selectedCategory = category
	}
</script>

<main class="py-24 min-h-screen">
	<div class="w-full max-w-screen-md mx-auto">
		<div class="flex flex-row gap-2">
			{#each data.categories as category}
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
		<div class="mt-10 post-list">
			{#each filteredPosts as post}
				<div class="w-full flex flex-col gap-4 border-b border-black mb-12">
					<a href={post.slug} class="contents">
						<h1 class="font-boogy text-xl text-center">{post.title}</h1>
						<div class="grid grid-cols-2">
							<p class="font-martina text-base w-full text-center">{post.byline}</p>
							<p class="font-martina text-base w-full text-center">{post.date}</p>
						</div>
					</a>
				</div>
			{/each}
		</div>
	</div>
</main>
