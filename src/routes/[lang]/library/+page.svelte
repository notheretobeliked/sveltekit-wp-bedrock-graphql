<script lang="ts">
	import { slide } from 'svelte/transition'
	import { onMount } from 'svelte'
	import { labelTranslations } from '$stores/translations'
	import { get } from 'svelte/store'
	import { page } from '$app/stores'

	const translations = get(labelTranslations)


	import type { PageData } from './$types'
	import type { Book } from '$lib/types/general'
	import Label from '$components/molecules/label.svelte'
	export let data: PageData

	let books: Book[] = (data.books ?? []).map((book) => ({
		...book,
		slug: book.slug ?? '',
		thumbnailCoverImage: book.thumbnailCoverImage as unknown as ImageObject | null
	})) as Book[]
	let artists: { name: string; slug: string }[] = data.artists ?? []
	let authors: { name: string; slug: string }[] = data.authors ?? []
	let publishers: { name: string; slug: string }[] = data.publishers ?? []
	let lang = data.language as 'ar' | 'en'

	// Filter state
	let selectedArtist = ''
	let selectedAuthor = ''
	let selectedPublisher = ''
	let searchFilter = ''
	// Add these new filter state variables
	let yearFrom = ''
	let yearTo = ''

	// Use the yearRange from the server data
	let yearRange = data.yearRange
	let yearsAscending =
		yearRange.minYear && yearRange.maxYear
			? Array.from({ length: yearRange.maxYear - yearRange.minYear + 1 }, (_, i) =>
					(yearRange.minYear! + i).toString()
				)
			: []

	let yearsDescending = [...yearsAscending].reverse()

	// Preselect the first and last years
	yearFrom = yearsAscending[0] || ''
	yearTo = yearsDescending[0] || ''

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
		// This reactive statement will run whenever the route params change
		$page.params.lang
		// Reset all state variables
		selectedArtist = ''
		selectedAuthor = ''
		selectedPublisher = ''
		searchFilter = ''
		yearFrom = yearsAscending[0] || ''
		yearTo = yearsDescending[0] || ''
		// Reinitialize books and other data
		books = (data.books ?? []).map((book) => ({
			...book,
			slug: book.slug ?? '',
			thumbnailCoverImage: book.thumbnailCoverImage as unknown as ImageObject | null
		})) as Book[]
		artists = data.artists ?? []
		authors = data.authors ?? []
		publishers = data.publishers ?? []
		lang = data.language as 'ar' | 'en'
		// Reapply filters
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
	<div
		class="mb-8 grid md:grid-cols-6 gap-4 mx-auto font-martina max-w-screen-xl sticky top-8 z-10"
	>
		{#if artists.length > 0}
			<select bind:value={selectedArtist} class="border-white border rounded-md p-2 bg-black">
				<option value="">{translations.artistdesigner[lang]}</option>
				{#each artists as artist}
					<option value={artist.slug}>{artist.name}</option>
				{/each}
			</select>
		{/if}

		{#if authors.length > 0}
			<select bind:value={selectedAuthor} class="border-white border rounded-md p-2 bg-black">
				<option value="">{translations.author[lang]}</option>
				{#each authors as author}
					<option value={author.slug}>{author.name}</option>
				{/each}
			</select>
		{/if}

		{#if publishers.length > 0}
			<select bind:value={selectedPublisher} class="border-white border rounded-md p-2 bg-black">
				<option value="">{translations.publisher[lang]}</option>
				{#each publishers as publisher}
					<option value={publisher.slug}>{publisher.name}</option>
				{/each}
			</select>
		{/if}

		<div class="grid grid-cols-2 gap-4">
			<select bind:value={yearFrom} class="border-white border rounded-md p-2 bg-black">
				{#each yearsAscending as year}
					<option value={year} class={lang === 'ar' ? 'text-right' : ''}>{year}</option>
				{/each}
			</select>

			<select bind:value={yearTo} class="border-white border rounded-md p-2 bg-black">
				{#each yearsDescending as year}
					<option value={year} class={lang === 'ar' ? 'text-right' : ''}>{year}</option>
				{/each}
			</select>
		</div>

		<input
			type="text"
			bind:value={searchFilter}
			placeholder={translations.search[lang]}
			class="border-white border rounded-md p-2 bg-black col-span-2 {lang === 'ar'
				? 'text-right'
				: ''}"
		/>
	</div>

	{#if filteredBooks.length > 0}
		<ul>
			{#each filteredBooks as book(book.slug)}
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
		<p>{translations.nobooks[lang]}</p>
	{/if}
</main>

<style lang="postcss">
	:global(body) {
		@apply bg-black text-white;
	}
	:root {
		--color: white;
		--active-color: black;
	}
	

</style>
