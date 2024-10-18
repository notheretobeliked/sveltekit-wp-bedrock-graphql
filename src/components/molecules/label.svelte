<script lang="ts">
	import type { Book } from '$lib/types/general'
	import LabelItem from '$components/atoms/labelItem.svelte'
	import Image from '$components/Image.svelte'
    import ImageGallery from './ImageGallery.svelte'
	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { labelTranslations } from '$stores/translations'

	export let book: Book
	export let lang: 'en' | 'ar' // Add this line to explicitly type lang
	const translations = get(labelTranslations)
	console.log(book)
	const labelData = {
		group1: [
			{ label: `${translations.ref[lang]}: ${book.ref}`, title: null }, // Ref label based on language
			...[
				{ label: translations.title[lang], title: book.title },
				{ label: translations.author[lang], title: book.author },
				{ label: translations.translator[lang], title: book.translation }
			].filter((item) => item.title) // Filter other items based on title
		],

		group2: [
			{ label: translations.publisher[lang], title: book.publisher },
			{ label: translations.place[lang], title: book.place },
			{ label: translations.year[lang], title: book.year },
			{ label: translations.edition[lang], title: book.edition }
		].filter((item) => item.title),

		group3: [
			{ label: translations.coverDesign[lang], title: book.coverDesign },
			{ label: translations.coverIllustration[lang], title: book.coverIllustration },
			{ label: translations.coverCalligraphy[lang], title: book.coverCalligraphy }
		].filter((item) => item.title),

		group4: [
			{ label: translations.pageDesign[lang], title: book.pageDesign },
			{ label: translations.pageIllustration[lang], title: book.pageIllustration },
			{ label: translations.pageCalligraphy[lang], title: book.pageCalligraphy }
		].filter((item) => item.title),

		group5: [
			{ label: translations.printer[lang], title: book.printer },
			{ label: translations.size[lang], title: book.size ? `${book.size} cm` : null },
			{
				label: translations.numberOfPages[lang],
				title: book.numperOfPages ? `${book.numperOfPages} ${translations.pages[lang]}` : null
			},
			{ label: translations.collection[lang], title: book.collection }
		]
	}

	const images = book.thumbnailImages ?? []

	const shouldUnderline = (index: number, total: number): boolean => {
		return total > 1 && index < total - 1
	}

	let showImages: boolean = false

	const toggleImages = () => {
		showImages = !showImages
		if (showImages) {
			// Use setTimeout to ensure the DOM has updated before scrolling
			setTimeout(() => {
				if (scrollContainer) {
					scrollContainer.scrollLeft = scrollContainer.scrollWidth
				}
			}, 0)
		}
	}

	let scrollContainer: HTMLDivElement

	onMount(() => {
		if (scrollContainer) {
			scrollContainer.scrollLeft = scrollContainer.scrollWidth
		}
	})

	console.log('Initial showImages value:', showImages)
</script>

<div class="md:grid-cols-6 grid gap-4">
	{#if !showImages}
		<div class="contents">
			<!-- Group 1 -->
			<div class="py-3 flex flex-col gap-2">
				{#each labelData.group1 as { label, title }, index}
					<LabelItem {label} {title} underline={shouldUnderline(index, labelData.group1.length)} />
				{/each}
			</div>

			<!-- Group 2 -->
			<div class="py-3 flex flex-col gap-2">
				{#each labelData.group2 as { label, title }, index}
					<LabelItem {label} {title} underline={shouldUnderline(index, labelData.group2.length)} />
				{/each}
			</div>

			<!-- Group 3 -->
			<div class="py-3 flex flex-col gap-2">
				{#each labelData.group3 as { label, title }, index}
					<LabelItem {label} {title} underline={shouldUnderline(index, labelData.group3.length)} />
				{/each}
			</div>

			<!-- Group 4 -->
			<div class="py-3 flex flex-col gap-2">
				{#each labelData.group4 as { label, title }, index}
					<LabelItem {label} {title} underline={shouldUnderline(index, labelData.group4.length)} />
				{/each}
			</div>

			<!-- Group 5 -->
			<div class="py-3 flex flex-col gap-2">
				{#each labelData.group5 as { label, title }, index}
					<LabelItem {label} {title} underline={shouldUnderline(index, labelData.group5.length)} />
				{/each}
			</div>
		</div>
	{:else}
		<div class="col-span-5">
			{#if images.length > 1}
				<div class="overflow-x-auto w-full" bind:this={scrollContainer}>
                    <ImageGallery {images} />
                </div>
			{/if}
		</div>
	{/if}

	<!-- Thumbnail Cover Image -->
	<div>
		{#if book.thumbnailCoverImage}
			<figure class="h-[160px]">
				{#if images.length > 1}
					<a on:click={toggleImages} class="cursor-pointer">
						<Image imageObject={book.thumbnailCoverImage} fit="contain" />
					</a>
				{:else}
					<Image imageObject={book.thumbnailCoverImage} fit="contain" />
				{/if}
			</figure>
		{/if}
	</div>
</div>
