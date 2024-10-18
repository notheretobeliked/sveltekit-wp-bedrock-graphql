<script lang="ts">
	import { slide } from 'svelte/transition'
	import type { PageData } from './$types'
	import type { Book } from '$lib/types/general'
	import Label from '$components/molecules/label.svelte'
	export let data: PageData

	const books: Book[] = (data.books ?? []).map((book) => ({
		...book,
		slug: book.slug ?? ''
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
	const lang = data.language

	/**
	 * Preprocess books to include filtered label groups.
	 */

	// Update the reactive filtered books statement
	$: filteredBooks = books.filter(
		(book) =>
			(!selectedArtist || book.artistFilterTerm?.includes(selectedArtist)) &&
			(!selectedAuthor || book.authorFilterTerm?.includes(selectedAuthor)) &&
			(!selectedPublisher || book.publisherFilterTerm?.includes(selectedPublisher)) &&
			(!yearFrom || (book.year && parseInt(book.year) >= parseInt(yearFrom))) &&
			(!yearTo || (book.year && parseInt(book.year) <= parseInt(yearTo))) &&
			(!searchFilter ||
				Object.values(book).some(
					(value) =>
						typeof value === 'string' && value.toLowerCase().includes(searchFilter.toLowerCase())
				))
	)

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
