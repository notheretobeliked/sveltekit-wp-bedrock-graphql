<script lang="ts">
	import { slide } from 'svelte/transition'
	import { onMount } from 'svelte'

	import type { PageData } from './$types'
	import type { Book } from '$lib/types/general'
	import Label from '$components/molecules/label.svelte'
	export let data: PageData

	const books: Book[] = (data.books ?? []).map((book) => ({
		...book,
		slug: book.slug ?? '',
		thumbnailCoverImage: book.thumbnailCoverImage as unknown as ImageObject | null
	})) as Book[]
	const artists: { name: string; slug: string }[] = data.artists ?? []
	const authors: { name: string; slug: string }[] = data.authors ?? []
	const publishers: { name: string; slug: string }[] = data.publishers ?? []

	// Filter state
	let selectedArtist = ''
	let selectedAuthor = ''
	let selectedPublisher = ''
	let searchFilter = ''
	// Add these new filter state variables
	let yearFrom = ''
	let yearTo = ''

	// Generate an array of years from 1900 to current year
	const currentYear = new Date().getFullYear()
	const years = Array.from({ length: currentYear - 1899 }, (_, i) => (currentYear - i).toString())
	const lang = data.language as 'ar' | 'en'


	/**
	 * Preprocess books to include filtered label groups.
	 */

	// Update the reactive filtered books statement
	let filteredBooks: typeof books = []

	// Function to apply filters
	function applyFilters() {
		filteredBooks = [] // Clear the array first
		setTimeout(() => {
			// Use setTimeout to ensure the clearing has taken effect
			filteredBooks = books.filter((book) => {
				const artistMatch =
					!selectedArtist || (book.artistFilterTerm?.split(' ') ?? []).includes(selectedArtist)
				const authorMatch =
					!selectedAuthor || (book.authorFilterTerm?.split(' ') ?? []).includes(selectedAuthor)
				const publisherMatch =
					!selectedPublisher ||
					(book.publisherFilterTerm?.split(' ') ?? []).includes(selectedPublisher)

				const yearFromMatch = !yearFrom || (book.year && book.year >= parseInt(yearFrom))
				const yearToMatch = !yearTo || (book.year && book.year <= parseInt(yearTo))

				const searchMatch =
					!searchFilter ||
					Object.values(book).some(
						(value) =>
							typeof value === 'string' && value.toLowerCase().includes(searchFilter.toLowerCase())
					)

				return (
					artistMatch &&
					authorMatch &&
					publisherMatch &&
					yearFromMatch &&
					yearToMatch &&
					searchMatch
				)
			})
		}, 0)
	}

	// Apply filters whenever any filter changes
	$: {
		selectedArtist, selectedAuthor, selectedPublisher, yearFrom, yearTo, searchFilter
		applyFilters()
	}

	onMount(() => {
		// Initialize filteredBooks with all books
		filteredBooks = [...books]
	})

	// For debugging
	$: console.log('Filtered Books:', filteredBooks)
	$: console.log('Filters:', {
		selectedArtist,
		selectedAuthor,
		selectedPublisher,
		yearFrom,
		yearTo,
		searchFilter
	})
</script>

<main class="py-24 min-h-screen mx-auto font-martina max-w-screen-xl">
	<header class="mb-8">
		<h1 class="text-center text-2xl !font-manchette">مكتبة</h1>
		<h1 class="text-center text-2xl !font-boogy">Library</h1>
	</header>
	<div class="mb-8 grid md:grid-cols-6 gap-4 mx-auto font-martina max-w-screen-xl sticky top-8">
		{#if artists.length > 0}
			<select bind:value={selectedArtist} class="border-white border rounded-md p-2 bg-black">
				<option value="">All Artists</option>
				{#each artists as artist}
					<option value={artist.slug}>{artist.name}</option>
				{/each}
			</select>
		{/if}

		{#if authors.length > 0}
			<select bind:value={selectedAuthor} class="border-white border rounded-md p-2 bg-black">
				<option value="">All Authors</option>
				{#each authors as author}
					<option value={author.slug}>{author.name}</option>
				{/each}
			</select>
		{/if}

		{#if publishers.length > 0}
			<select bind:value={selectedPublisher} class="border-white border rounded-md p-2 bg-black">
				<option value="">All Publishers</option>
				{#each publishers as publisher}
					<option value={publisher.slug}>{publisher.name}</option>
				{/each}
			</select>
		{/if}

		<div class="grid grid-cols-2 gap-4">
			<select bind:value={yearFrom} class="border-white border rounded-md p-2 bg-black">
				<option value="">Year from</option>
				{#each years as year}
					<option value={year} class={lang === 'ar' ? 'text-right' : ''}>{year}</option>
				{/each}
			</select>

			<select bind:value={yearTo} class="border-white border rounded-md p-2 bg-black">
				<option value="" class={lang === 'ar' ? 'text-right' : ''}>Year to</option>
				{#each years as year}
					<option value={year} class={lang === 'ar' ? 'text-right' : ''}>{year}</option>
				{/each}
			</select>
		</div>

		<input
			type="text"
			bind:value={searchFilter}
			placeholder="Search in all fields..."
			class="border-white border rounded-md p-2 bg-black col-span-2 {lang === 'ar'
				? 'text-right'
				: ''}"
		/>
	</div>

	{#if filteredBooks.length > 0}
		<ul>
			{#each filteredBooks as book}
				<li
					class="font-martina bg-black text-white py-4 border-b border-white {lang === 'ar'
						? 'text-right'
						: ''}"
					transition:slide={{ duration: 300 }}
				>
					<Label {book} {lang} />
				</li>
			{/each}
		</ul>
	{:else}
		<p>No books found matching the current filters.</p>
	{/if}
</main>

<style>
	:global(body) {
		@apply bg-black text-white;
	}
</style>
