<script lang="ts">
	import type { PageData } from './$types'
	export let data: PageData
	const books = data.data.books.nodes
	console.log(books)
</script>

<main class="py-24 min-h-screen">
	{#each books as book}
		<div class="mt-8 mx-auto max-w-screen-md bg-purple-light">
			<h2>{book.bookData.title}</h2>
			<p>{book.bookData.year}</p>
			<p>{book.bookData.place}</p>
		</div>
	{/each}
</main>
