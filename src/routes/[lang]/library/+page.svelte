<script lang="ts">
	import type { PageData } from './$types'
	import type { Book } from '$lib/types/general'
	import LabelItem from '$components/atoms/labelItem.svelte'
	export let data: PageData
	
	const books: Book[] = data.books ?? []
	const artists: { name: string; slug: string }[] = data.artists ?? []
	const authors: { name: string; slug: string }[] = data.authors ?? []
	const publishers: { name: string; slug: string }[] = data.publishers ?? []

	// Filter state
	let selectedArtist = ''
	let selectedAuthor = ''
	let selectedPublisher = ''
	let titleFilter = ''

	/**
	 * Preprocess books to include filtered label groups.
	 */
	const processedBooks = books.map((book) => ({
		...book,
		group1: [
			{ label: 'Ref: ' + book.ref, title: null }, // Always include Ref
			...[
				{ label: 'Title', title: book.title },
				{ label: 'Author', title: book.author },
				{ label: 'Translator', title: book.translation }
			].filter((item) => item.title) // Filter other items based on title
		],

		group2: [
			{ label: 'Publisher', title: book.publisher },
			{ label: 'Place', title: book.place },
			{ label: 'Year', title: book.year },
			{ label: 'Edition', title: book.edition }
		].filter((item) => item.title),

		group3: [
			{ label: 'Cover Design', title: book.coverDesign },
			{ label: 'Cover Illustration', title: book.coverIllustration },
			{ label: 'Cover Calligraphy', title: book.coverCalligraphy }
		].filter((item) => item.title),

		group4: [
			{ label: 'Page Design', title: book.pageDesign },
			{ label: 'Page Illustration', title: book.pageIllustration },
			{ label: 'Page Calligraphy', title: book.pageCalligraphy }
		].filter((item) => item.title),

		group5: [
			{ label: 'Printer', title: book.printer },
			{ label: 'Size', title: book.size ? `${book.size} cm` : null },
			{
				label: 'Number of Pages',
				title: book.numperOfPages ? `${book.numperOfPages} pages` : null
			},
			{ label: 'Collection', title: book.collection }
		].filter((item) => item.title)
	}))

	// Reactive filtered books
	$: filteredBooks = processedBooks.filter(book => 
		(!selectedArtist || book.artistFilterTerm?.includes(selectedArtist)) &&
		(!selectedAuthor || book.authorFilterTerm?.includes(selectedAuthor)) &&
		(!selectedPublisher || book.publisherFilterTerm?.includes(selectedPublisher)) &&
		(!titleFilter || book.title?.toLowerCase().includes(titleFilter.toLowerCase()))
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

<main class="py-24 min-h-screen">
	<div class="mb-8">
		{#if artists.length > 0}
			<select bind:value={selectedArtist}>
				<option value="">All Artists</option>
				{#each artists as artist}
					<option value={artist.slug}>{artist.name}</option>
				{/each}
			</select>
		{/if}

		{#if authors.length > 0}
			<select bind:value={selectedAuthor}>
				<option value="">All Authors</option>
				{#each authors as author}
					<option value={author.slug}>{author.name}</option>
				{/each}
			</select>
		{/if}

		{#if publishers.length > 0}
			<select bind:value={selectedPublisher}>
				<option value="">All Publishers</option>
				{#each publishers as publisher}
					<option value={publisher.slug}>{publisher.name}</option>
				{/each}
			</select>
		{/if}

		<input type="text" bind:value={titleFilter} placeholder="Filter by title...">
	</div>

	{#if filteredBooks.length > 0}
		<ul>
			{#each filteredBooks as book}
				<li class="mt-8 mx-auto font-sans max-w-screen-xl bg-black text-white">
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
								<figure>
									<img src={book.thumbnailCoverImage.sourceUrl} alt={book.title} />
								</figure>
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