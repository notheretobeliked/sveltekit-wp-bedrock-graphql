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

	let artistsOpen = false
	let authorsOpen = false
	let publishersOpen = false
	let yearFromOpen = false
	let yearToOpen = false
	let filterContainer: HTMLDivElement
	let scrollY: number
	let filterTop: number
	let isSticky = false

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement
		if (!target.closest('.relative')) {
			artistsOpen = false
			authorsOpen = false
			publishersOpen = false
			yearFromOpen = false
			yearToOpen = false
		}
	}

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
				!$filterStore.yearFrom || // no minimum year selected
				!book.year || // book has no year (should still show up)
				book.year >= parseInt($filterStore.yearFrom)

			const yearToMatch =
				!$filterStore.yearTo || // no maximum year selected
				!book.year || // book has no year (should still show up)
				book.year <= parseInt($filterStore.yearTo)

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
		$filterStore
		applyFilters()
		isSticky = scrollY > filterTop - 80
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
		filterTop = filterContainer?.offsetTop || 0

		// Initialize filteredBooks with all books
		filteredBooks = [...books]
		document.addEventListener('click', handleClickOutside)
		return () => {
			document.removeEventListener('click', handleClickOutside)
		}
	})
</script>

<svelte:window bind:scrollY />
<main class="py-24 w-screen bg-black text-white-pure {lang === 'ar' ? 'main-ar' : ''}">
	<div class="min-h-screen mx-auto font-martina max-w-screen-xl">
		<header class="mb-8">
			<h1 class="text-center text-2xl !font-manchette">مكتبة</h1>
			<h1 class="text-center text-2xl !font-boogy">Library</h1>
		</header>
		<div
			bind:this={filterContainer}
			class="{isSticky &&
				'fixed'} top-[80px] left-0 right-0 z-10 mb-8 grid md:grid-cols-6 gap-4 mx-auto font-martina max-w-full lg:max-w-screen-xl"
		>
			{#if artists.length > 0}
				<div class="relative">
					<div
						class="border-white border rounded-md p-2 {$filterStore.selectedArtist
							? 'bg-white-off text-black'
							: 'bg-black text-white-pure'} cursor-pointer text-sm relative flex items-center"
						on:click={() => (artistsOpen = !artistsOpen)}
					>
						<span class="truncate pr-6">
							{$filterStore.selectedArtist
								? artists.find((a) => a.slug === $filterStore.selectedArtist)?.name
								: translations.artistdesigner[lang]}
						</span>

						{#if $filterStore.selectedArtist}
							<button
								class="absolute right-2 top-1/2 -translate-y-1/2"
								on:click|stopPropagation={() => updateFilter('selectedArtist', '')}
							>
								×
							</button>
						{/if}
					</div>

					{#if artistsOpen}
						<div
							class="absolute w-full mt-1 max-h-[70vh] overflow-y-auto bg-black border border-white rounded-md"
							transition:slide
						>
							{#each artists as artist}
								<div
									class="p-2 hover:bg-white-off hover:text-black cursor-pointer text-sm"
									on:click={() => {
										updateFilter('selectedArtist', artist.slug)
										artistsOpen = false
									}}
								>
									{artist.name}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			{#if authors.length > 0}
				<div class="relative">
					<div
						class="border-white border rounded-md p-2 {$filterStore.selectedAuthor
							? 'bg-white-off text-black'
							: 'bg-black text-white-pure'} cursor-pointer text-sm relative flex items-center"
						on:click={() => (authorsOpen = !authorsOpen)}
					>
						<span class="truncate pr-6">
							{$filterStore.selectedAuthor
								? authors.find((a) => a.slug === $filterStore.selectedAuthor)?.name
								: translations.author[lang]}
						</span>

						{#if $filterStore.selectedAuthor}
							<button
								class="absolute right-2 top-1/2 -translate-y-1/2"
								on:click|stopPropagation={() => updateFilter('selectedAuthor', '')}
							>
								×
							</button>
						{/if}
					</div>
					{#if authorsOpen}
						<div
							class="absolute w-full mt-1 max-h-[70vh] overflow-y-auto bg-black border border-white rounded-md"
							transition:slide
						>
							{#each authors as author}
								<div
									class="p-2 hover:bg-white-off hover:text-black cursor-pointer text-sm"
									on:click={() => {
										updateFilter('selectedAuthor', author.slug)
										authorsOpen = false
									}}
								>
									{author.name}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			{#if publishers.length > 0}
				<div class="relative">
					<div
						class="border-white border rounded-md p-2 {$filterStore.selectedPublisher
							? 'bg-white-off text-black'
							: 'bg-black text-white-pure'} cursor-pointer text-sm relative flex items-center"
						on:click={() => (publishersOpen = !publishersOpen)}
					>
						<span class="truncate pr-6">
							{$filterStore.selectedPublisher
								? publishers.find((p) => p.slug === $filterStore.selectedPublisher)?.name
								: translations.publisher[lang]}
						</span>

						{#if $filterStore.selectedPublisher}
							<button
								class="absolute right-2 top-1/2 -translate-y-1/2"
								on:click|stopPropagation={() => updateFilter('selectedPublisher', '')}
							>
								×
							</button>
						{/if}
					</div>
					{#if publishersOpen}
						<div
							class="absolute w-full mt-1 max-h-[70vh] overflow-y-auto bg-black border border-white rounded-md"
							transition:slide
						>
							{#each publishers as publisher}
								<div
									class="p-2 hover:bg-white-off hover:text-black cursor-pointer text-sm"
									on:click={() => {
										updateFilter('selectedPublisher', publisher.slug)
										publishersOpen = false
									}}
								>
									{publisher.name}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}

			<div class="grid grid-cols-2 gap-4">
				<div class="relative">
					<div
						class="border-white border rounded-md p-2 cursor-pointer text-sm relative flex items-center {lang ===
						'ar'
							? 'text-right'
							: ''} {$filterStore.yearFrom !== yearsAscending[0]
							? 'bg-white-off text-black'
							: 'bg-black'}"
						on:click={() => (yearFromOpen = !yearFromOpen)}
					>
						<span class="truncate pr-6">
							{$filterStore.yearFrom || yearsAscending[0]}
						</span>
						{#if $filterStore.yearFrom !== yearsAscending[0]}
							<button
								class="absolute right-2 top-1/2 -translate-y-1/2"
								on:click|stopPropagation={() => updateFilter('yearFrom', yearsAscending[0])}
							>
								×
							</button>
						{/if}
					</div>

					{#if yearFromOpen}
						<div
							class="absolute w-full mt-1 max-h-[70vh] overflow-y-auto bg-black border border-white rounded-md"
							transition:slide
						>
							{#each yearsAscending as year}
								<div
									class="p-2 hover:bg-white-off hover:text-black cursor-pointer text-sm {lang ===
									'ar'
										? 'text-right'
										: ''}"
									on:click={() => {
										updateFilter('yearFrom', year)
										if (parseInt(year) > parseInt($filterStore.yearTo)) {
											updateFilter('yearTo', year)
										}
										yearFromOpen = false
									}}
								>
									{year}
								</div>
							{/each}
						</div>
					{/if}
				</div>

				<div class="relative">
					<div
						class="border-white border rounded-md p-2 cursor-pointer text-sm relative flex items-center {lang ===
						'ar'
							? 'text-right'
							: ''} {$filterStore.yearTo !== yearsDescending[0]
							? 'bg-white-off text-black'
							: 'bg-black'}"
						on:click={() => (yearToOpen = !yearToOpen)}
					>
						<span class="truncate pr-6">
							{$filterStore.yearTo || yearsDescending[0]}
						</span>
						{#if $filterStore.yearTo !== yearsDescending[0]}
							<button
								class="absolute right-2 top-1/2 -translate-y-1/2"
								on:click|stopPropagation={() => updateFilter('yearTo', yearsDescending[0])}
							>
								×
							</button>
						{/if}
					</div>
					{#if yearToOpen}
						<div
							class="absolute w-full mt-1 max-h-[70vh] overflow-y-auto bg-black border text-sm border-white rounded-md"
							transition:slide
						>
							{#each yearsDescending as year}
								<div
									class="p-2 hover:bg-white-off hover:text-black cursor-pointer text-sm {lang ===
									'ar'
										? 'text-right'
										: ''}"
									on:click={() => {
										updateFilter('yearTo', year)
										if (parseInt(year) < parseInt($filterStore.yearFrom)) {
											updateFilter('yearFrom', year)
										}
										yearToOpen = false
									}}
								>
									{year}
								</div>
							{/each}
						</div>
					{/if}
				</div>
			</div>

			<div class="relative col-span-2">
				<input
					type="text"
					bind:value={$filterStore.searchFilter}
					on:input={(e) => updateFilter('searchFilter', e.currentTarget.value)}
					placeholder={translations.search[lang]}
					class="border-white border rounded-md p-2 bg-black w-full text-sm {lang === 'ar'
						? 'text-right pr-2 pl-8'
						: 'pl-2 pr-8'}"
				/>
				{#if $filterStore.searchFilter}
					<button
						class="absolute {lang === 'ar' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2"
						on:click={() => updateFilter('searchFilter', '')}
					>
						×
					</button>
				{/if}
			</div>
		</div>
		{#if isSticky}
			<div class="h-[116px]"></div>
			<!-- Adjust height to match your filters -->
		{/if}
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

