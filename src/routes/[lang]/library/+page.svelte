<script lang="ts">
	import { slide } from 'svelte/transition'
	import { onMount } from 'svelte'
	import { labelTranslations } from '$stores/translations'
	import { filterStore } from '$stores/filterStore'
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

	// Use the yearRange from the server data
	let yearRange = data.yearRange
	let yearsAscending =
		yearRange.minYear && yearRange.maxYear
			? Array.from({ length: yearRange.maxYear - yearRange.minYear + 1 }, (_, i) =>
					(yearRange.minYear! + i).toString()
				)
			: []

	let yearsDescending = [...yearsAscending].reverse()

	let filteredBooks: typeof books = []

	// Initialize filterStore with default values
	filterStore.set({
		selectedArtist: '',
		selectedAuthor: '',
		selectedPublisher: '',
		yearFrom: yearsAscending[0] || '',
		yearTo: yearsDescending[0] || '',
		searchFilter: ''
	})

	// Debugging function
	function logState(message: string) {
		console.log(message, {
			...$filterStore,
			filteredBooksCount: filteredBooks.length
		})
	}

	// Function to update a single filter value
	function updateFilter(key: string, value: string) {
		filterStore.update((store) => ({ ...store, [key]: value }))
		logState(`${key} filter changed`)
	}

	// Function to apply filters
	function applyFilters() {
		filteredBooks = books.filter((book) => {
			const artistMatch =
				!$filterStore.selectedArtist ||
				(book.artistFilterTerm?.split(' ') ?? []).includes($filterStore.selectedArtist)
			const authorMatch =
				!$filterStore.selectedAuthor ||
				(book.authorFilterTerm?.split(' ') ?? []).includes($filterStore.selectedAuthor)
			const publisherMatch =
				!$filterStore.selectedPublisher ||
				(book.publisherFilterTerm?.split(' ') ?? []).includes($filterStore.selectedPublisher)

			const yearFromMatch =
				!$filterStore.yearFrom || (book.year && book.year >= parseInt($filterStore.yearFrom))
			const yearToMatch =
				!$filterStore.yearTo || (book.year && book.year <= parseInt($filterStore.yearTo))

			const searchMatch =
				!$filterStore.searchFilter ||
				Object.values(book).some(
					(value) =>
						typeof value === 'string' &&
						value.toLowerCase().includes($filterStore.searchFilter.toLowerCase())
				)

			return (
				artistMatch && authorMatch && publisherMatch && yearFromMatch && yearToMatch && searchMatch
			)
		})
	}

	// Apply filters whenever the store changes
	$: {
		applyFilters()
	}

	// Handle route changes
	$: {
		$page.params.lang

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
</script>

<main class="py-24 w-screen bg-black text-white-pure">
	<div class="min-h-screen mx-auto font-martina max-w-screen-xl">
		<header class="mb-8">
			<h1 class="text-center text-2xl !font-manchette">مكتبة</h1>
			<h1 class="text-center text-2xl !font-boogy">Library</h1>
		</header>
		<div
			class="mb-8 grid md:grid-cols-6 gap-4 mx-auto font-martina max-w-screen-xl sticky top-8 z-10"
		>
			{#if artists.length > 0}
				<select
					bind:value={$filterStore.selectedArtist}
					on:change={(e) => updateFilter('selectedArtist', e.currentTarget.value)}
					class="border-white border rounded-md p-2 bg-black"
				>
					<option value="">{translations.artistdesigner[lang]}</option>
					{#each artists as artist}
						<option value={artist.slug}>{artist.name}</option>
					{/each}
				</select>
			{/if}

			{#if authors.length > 0}
				<select
					bind:value={$filterStore.selectedAuthor}
					on:change={(e) => updateFilter('selectedAuthor', e.currentTarget.value)}
					class="border-white border rounded-md p-2 bg-black"
				>
					<option value="">{translations.author[lang]}</option>
					{#each authors as author}
						<option value={author.slug}>{author.name}</option>
					{/each}
				</select>
			{/if}

			{#if publishers.length > 0}
				<select
					bind:value={$filterStore.selectedPublisher}
					on:change={(e) => updateFilter('selectedPublisher', e.currentTarget.value)}
					class="border-white border rounded-md p-2 bg-black"
				>
					<option value="">{translations.publisher[lang]}</option>
					{#each publishers as publisher}
						<option value={publisher.slug}>{publisher.name}</option>
					{/each}
				</select>
			{/if}

			<div class="grid grid-cols-2 gap-4">
				<select
					bind:value={$filterStore.yearFrom}
					on:change={(e) => {
						updateFilter('yearFrom', e.currentTarget.value)
						if (parseInt(e.currentTarget.value) > parseInt($filterStore.yearTo)) {
							updateFilter('yearTo', e.currentTarget.value)
						}
					}}
					class="border-white border rounded-md p-2 bg-black"
				>
					{#each yearsAscending as year}
						<option value={year} class={lang === 'ar' ? 'text-right' : ''}>{year}</option>
					{/each}
				</select>

				<select
					bind:value={$filterStore.yearTo}
					on:change={(e) => {
						updateFilter('yearTo', e.currentTarget.value)
						if (parseInt(e.currentTarget.value) < parseInt($filterStore.yearFrom)) {
							updateFilter('yearFrom', e.currentTarget.value)
						}
					}}
					class="border-white border rounded-md p-2 bg-black"
				>
					{#each yearsDescending as year}
						<option value={year} class={lang === 'ar' ? 'text-right' : ''}>{year}</option>
					{/each}
				</select>
			</div>

			<input
				type="text"
				bind:value={$filterStore.searchFilter}
				on:input={(e) => updateFilter('searchFilter', e.currentTarget.value)}
				placeholder={translations.search[lang]}
				class="border-white border rounded-md p-2 bg-black col-span-2 {lang === 'ar'
					? 'text-right'
					: ''}"
			/>
		</div>

		{#if filteredBooks.length > 0}
			<ul>
				{#each filteredBooks as book (book.slug)}
					<li
						class="font-martina bg-black text-white-pure py-4 border-b border-white {lang === 'ar'
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
	</div>
</main>

<style lang="postcss">
	:root {
		--color: white;
		--active-color: black;
	}
</style>
