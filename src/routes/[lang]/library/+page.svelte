<script lang="ts">
	import type { PageData } from './$types'
	export let data: PageData
	const books = data?.data?.books?.nodes
	console.log(books)
</script>

<main class="py-24 min-h-screen">
	{#if books}
		<ul>
			{#each books as book}
				<li class="mt-8 mx-auto font-sans max-w-screen-xl bg-purple-base">
					<div class="xl:grid-cols-5 grid gap-4">
						<div class="py-3 flex flex-col gap-2">
							<div class="border-white border-b">
								<p class="text-xs uppercase">Ref: {book.bookData?.ref}</p>
							</div>
							<div class="border-white border-b">
								<p class="text-xs uppercase">Title:</p>
								<p class="text-base">{book.bookData?.title}</p>
							</div>
							{#if book.bookData?.personAuthor?.nodes[0]}
								<div class="border-white border-b">
									<p class="text-xs uppercase">Author:</p>
									<p class="text-base">{book.bookData?.personAuthor?.nodes[0].name}</p>
								</div>
							{/if}
							{#if book.bookData?.personTranslation?.nodes[0]}
								<div class="border-white border-b">
									<p class="text-xs uppercase">Translator:</p>
									<p class="text-base">{book.bookData?.personTranslation?.nodes[0].name}</p>
								</div>
							{/if}
						</div>
						<div>
							{#if book.bookData?.publisher?.nodes[0]}
								<div class="">
									<p class="text-xs uppercase">Publisher:</p>
									<p class="text-base mb-0">
										{book.bookData?.publisher?.nodes[0].name}
									</p>
									<p class="text-base mb-0">
										{book.bookData?.place}
									</p>
									<p class="text-base mb-0">
										{book.bookData?.year}
									</p>
									<p class="text-base mb-0">
										{book.bookData?.edition}
									</p>
								</div>
							{/if}
						</div>
						<div>
							{#if book.bookData?.personCoverDesign?.nodes[0]}
								<div class="border-white border-b">
									<p class="text-xs uppercase">Cover design:</p>
									<p class="text-base">{book.bookData?.personCoverDesign?.nodes[0].name}</p>
								</div>
							{/if}
							{#if book.bookData?.personCoverIllustration?.nodes[0]}
								<div class="border-white border-b">
									<p class="text-xs uppercase">Cover illustration:</p>
									<p class="text-base">{book.bookData?.personCoverIllustration?.nodes[0].name}</p>
								</div>
							{/if}
							{#if book.bookData?.personCoverCalligraphy?.nodes[0]}
								<div class="border-white border-b">
									<p class="text-xs uppercase">Cover Calligraphy:</p>
									<p class="text-base">{book.bookData?.personCoverCalligraphy?.nodes[0].name}</p>
								</div>
							{/if}
						</div>
						<div>
							{#if book.bookData?.personPageDesign?.nodes[0]}
								<div class="border-white border-b">
									<p class="text-xs uppercase">Page Design:</p>
									<p class="text-base">{book.bookData?.personPageDesign?.nodes[0].name}</p>
								</div>
							{/if}
							{#if book.bookData?.personPageIllustration?.nodes[0]}
								<div class="border-white border-b">
									<p class="text-xs uppercase">Page illustration:</p>
									<p class="text-base">{book.bookData?.personPageIllustration?.nodes[0].name}</p>
								</div>
							{/if}
							{#if book.bookData?.personPageCalligraphy?.nodes[0]}
								<div class="border-white border-b">
									<p class="text-xs uppercase">Page illustration:</p>
									<p class="text-base">{book.bookData?.personPageCalligraphy?.nodes[0].name}</p>
								</div>
							{/if}


						</div>
						<div>
							{#if book.bookData?.printer}
								<div class="border-white border-b">
									<p class="text-xs uppercase">Printer:</p>
									<p class="text-base">{book.bookData?.printer}</p>
								</div>
							{/if}

							{#if book.bookData?.size}
								<div class="border-white border-b">
									<p class="text-xs uppercase">Size:</p>
									<p class="text-base">{book.bookData?.size}</p>
									<p class="text-base">{book.bookData?.numperOfPages} pages</p>
								</div>
							{/if}

							{#if book.bookData?.collection?.nodes[0]}
								<div class="border-white border-b">
									<p class="text-xs uppercase">Collection:</p>
									<p class="text-base">{book.bookData?.collection?.nodes[0].name}</p>
								</div>
							{/if}

						</div>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</main>
