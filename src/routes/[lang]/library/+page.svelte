<script lang="ts">
	import { slide } from 'svelte/transition'
	import type { PageData } from './$types'
	import type { Book } from '$lib/types/general'
	import LabelItem from '$components/atoms/labelItem.svelte'
	import Image from '$components/Image.svelte'
	import Label from '$components/molecules/label.svelte'
	export let data: PageData

	const books: Book[] = data.books ?? []
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
	const labelTranslations = data.labelTranslations
	console.log(labelTranslations)
	/**
	 * Preprocess books to include filtered label groups.
	 */
	const processedBooks = books.map((book) => ({
		...book,
		group1: [
			{ label: `${labelTranslations.ref[lang]}: ${book.ref}`, title: null }, // Ref label based on language
			...[
				{ label: labelTranslations.title[lang], title: book.title },
				{ label: labelTranslations.author[lang], title: book.author },
				{ label: labelTranslations.translator[lang], title: book.translation }
			].filter((item) => item.title) // Filter other items based on title
		],

		group2: [
			{ label: labelTranslations.publisher[lang], title: book.publisher },
			{ label: labelTranslations.place[lang], title: book.place },
			{ label: labelTranslations.year[lang], title: book.year },
			{ label: labelTranslations.edition[lang], title: book.edition }
		].filter((item) => item.title),

		group3: [
			{ label: labelTranslations.coverDesign[lang], title: book.coverDesign },
			{ label: labelTranslations.coverIllustration[lang], title: book.coverIllustration },
			{ label: labelTranslations.coverCalligraphy[lang], title: book.coverCalligraphy }
		].filter((item) => item.title),

		group4: [
			{ label: labelTranslations.pageDesign[lang], title: book.pageDesign },
			{ label: labelTranslations.pageIllustration[lang], title: book.pageIllustration },
			{ label: labelTranslations.pageCalligraphy[lang], title: book.pageCalligraphy }
		].filter((item) => item.title),

		group5: [
			{ label: labelTranslations.printer[lang], title: book.printer },
			{ label: labelTranslations.size[lang], title: book.size ? `${book.size} cm` : null },
			{
				label: labelTranslations.numberOfPages[lang],
				title: book.numperOfPages ? `${book.numperOfPages} ${labelTranslations.pages[lang]}` : null
			},
			{ label: labelTranslations.collection[lang], title: book.collection }
		].filter((item) => item.title)
	}))

	// Update the reactive filtered books statement
	$: filteredBooks = processedBooks.filter(
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

	/**
	 * Determines whether to underline a LabelItem.
	 * @param index - The current index in the group.
	 * @param total - Total number of items in the group.
	 * @returns {boolean} - True if underlined, false otherwise.
	 */
	function shouldUnderline(index: number, total: number): boolean {
		return total > 1 && index < total - 1
	}

	console.log('Data received:', data)
</script>

<main class="py-24 min-h-screen mx-auto font-sans max-w-screen-xl">
	<header class="mb-8">
		<h1 class="text-center text-2xl !font-manchette">مكتبة</h1>
		<h1 class="text-center text-2xl !font-boogy">Library</h1>
	</header>
	<div class="mb-8 grid lg:grid-cols-6 gap-4 mx-auto font-sans max-w-screen-xl sticky top-8">
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
			class="border-white border rounded-md p-2 bg-black col-span-2 {lang === 'ar' ? 'text-right' : ''}"
		/>
	</div>

	{#if filteredBooks.length > 0}
		<ul>
			{#each filteredBooks as book}
				<li
					class="font-sans bg-black text-white py-4 border-b border-white {lang === 'ar' ? 'text-right' : ''}"
					transition:slide={{ duration: 300 }}
				>
					<div class="xl:grid-cols-6 grid gap-4">
						<!-- Group 1 -->
						<div class="py-3 flex flex-col gap-2">
							{#each book.group1 as { label, title }, index}
								<LabelItem {label} {title} underline={shouldUnderline(index, book.group1.length)} />
							{/each}
						</div>

						<!-- Group 2 -->
						<div class="py-3 flex flex-col gap-2">
							{#each book.group2 as { label, title }, index}
								<LabelItem {label} {title} underline={shouldUnderline(index, book.group2.length)} />
							{/each}
						</div>

						<!-- Group 3 -->
						<div class="py-3 flex flex-col gap-2">
							{#each book.group3 as { label, title }, index}
								<LabelItem {label} {title} underline={shouldUnderline(index, book.group3.length)} />
							{/each}
						</div>

						<!-- Group 4 -->
						<div class="py-3 flex flex-col gap-2">
							{#each book.group4 as { label, title }, index}
								<LabelItem {label} {title} underline={shouldUnderline(index, book.group4.length)} />
							{/each}
						</div>

						<!-- Group 5 -->
						<div class="py-3 flex flex-col gap-2">
							{#each book.group5 as { label, title }, index}
								<LabelItem {label} {title} underline={shouldUnderline(index, book.group5.length)} />
							{/each}
						</div>

						<!-- Thumbnail Cover Image -->
						<div>
							{#if book.thumbnailCoverImage}
								<Image imageObject={book.thumbnailCoverImage} fit="contain" />
							{/if}
						</div>
					</div>
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
