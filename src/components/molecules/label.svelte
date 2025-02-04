<script lang="ts">
	import type { Book } from '$lib/types/general'
	import LabelAndTitle from '$components/atoms/LabelAndTitle.svelte'

	import Image from '$components/Image.svelte'
	import ImageOverlay from '$components/molecules/ImageOverlay.svelte'
	import ImageGallery from './ImageGallery.svelte'
	import { slide } from 'svelte/transition'

	import { onMount } from 'svelte'
	import { get } from 'svelte/store'
	import { labelTranslations } from '$stores/translations'
	const duration = 300 // Duration of the slide animation in milliseconds

	export let book: Book
	export let lang: 'en' | 'ar' // Add this line to explicitly type lang

	const translations = get(labelTranslations)
	let selectedImageIndex: number | null = null

	interface LabelGroup {
		label: string
		title: string | null
		alwaysShow?: boolean
		ref?: string | null
	}

	interface LabelData {
		[key: string]: LabelGroup[]
	}

	const labelData: LabelData = {
		group1: [
			{
				label: `${translations.ref[lang]}: ${book.ref}`,
				title: null,
				ref: book.ref
			}, // Ref label based on language
			...[
				{
					label: translations.title[lang],
					title: book.title
				},
				{
					label: translations.author[lang],
					title: book.author
				},
				{
					label: translations.translator[lang],
					title: book.translation
				}
			].filter((item) => item.title) // Filter other items based on title
		],

		group2: [
			{
				label: translations.publisher[lang],
				title: book.publisher
			},
			{
				label: translations.place[lang],
				title: book.place
			},
			{
				label: translations.year[lang],
				title: book.year?.toString() || null
			},
			{
				label: translations.edition[lang],
				title: book.edition
			}
		].filter((item) => item.title),

		group3: [
			{
				label: translations.coverDesign[lang],
				title: book.coverDesign
			},
			{
				label: translations.coverIllustration[lang],
				title: book.coverIllustration
			},
			{
				label: translations.coverCalligraphy[lang],
				title: book.coverCalligraphy
			}
		].filter((item) => item.title),

		group4: [
			{
				label: translations.pageDesign[lang],
				title: book.pageDesign
			},
			{
				label: translations.pageIllustration[lang],
				title: book.pageIllustration
			},
			{
				label: translations.pageCalligraphy[lang],
				title: book.pageCalligraphy
			}
		].filter((item) => item.title),

		group5: [
			{
				label: translations.printer[lang],
				title: book.printer
			},
			{
				label: translations.size[lang],
				title: book.size ? `${book.size} cm` : null
			},
			{
				label: translations.numberOfPages[lang],
				title: book.numperOfPages ? `${book.numperOfPages} ${translations.pages[lang]}` : null
			},
			{
				label: translations.collection[lang],
				title: book.collection
			},
			{
				label: 'Notes',
				title: book.notes
			}
		].filter((item) => item.title)
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

	function openOverlay(index: number) {
		selectedImageIndex = index
	}

	function closeOverlay() {
		selectedImageIndex = null
	}

	function navigateImage(direction: 'prev' | 'next') {
		if (selectedImageIndex !== null) {
			selectedImageIndex =
				(selectedImageIndex + (direction === 'next' ? 1 : -1) + images.length) % images.length
		}
	}

	let scrollContainer: HTMLDivElement

	let smallScreen = false

	onMount(() => {
		const mediaQuery = window.matchMedia('(min-width: 1024px)')
		smallScreen = !mediaQuery.matches
		smallScreen && toggleImages()
		if (scrollContainer) {
			scrollContainer.scrollLeft = scrollContainer.scrollWidth
		}
	})
</script>

<div class="grid-cols-6 grid gap-4 label-grid">
	<div class="col-span-6 lg:col-span-5 flex flex-col">
		{#if showImages}
			<div transition:slide={{ duration }} class="order-2 lg:order-1">
				{#if images.length > 1 || smallScreen}
					<div class="overflow-x-auto w-full" bind:this={scrollContainer}>
						<ImageGallery {images} />
					</div>
				{/if}
			</div>
		{/if}
		<div class="grid grid-cols-2 lg:grid-cols-5 gap-4 order-1 lg:order-2" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
			<!-- Group 1 -->
			<div class="lg:contents pl-4 lg:pl-0">
				<div class="lg:py-3 flex flex-col gap-2">
					{#each labelData.group1 as { label, title, ref }, index}
						<LabelAndTitle
							{label}
							{title}
							{ref}
							underline={smallScreen ? true : shouldUnderline(index, labelData.group1.length)}
						/>
					{/each}
				</div>

				<!-- Group 2 -->
				<div class="lg:py-3 flex flex-col gap-2">
					{#each labelData.group2 as { label, title }, index}
						<LabelAndTitle
							{label}
							{title}
							underline={shouldUnderline(index, labelData.group2.length)}
						/>
					{/each}
				</div>
			</div>
			<div class="lg:contents pr-4 lg:pr-0">
				<!-- Group 3 -->
				<div class="lg:py-3 flex flex-col gap-2">
					{#each labelData.group3 as { label, title }, index}
						<LabelAndTitle
							{label}
							{title}
							underline={smallScreen ? true : shouldUnderline(index, labelData.group1.length)}
						/>
					{/each}
				</div>

				<!-- Group 4 -->
				<div class="lg:py-3 flex flex-col gap-2">
					{#each labelData.group4 as { label, title }, index}
						<LabelAndTitle
							{label}
							{title}
							underline={smallScreen ? true : shouldUnderline(index, labelData.group1.length)}
						/>
					{/each}
				</div>

				<!-- Group 5 -->
				<div class="lg:py-3 flex flex-col gap-2">
					{#each labelData.group5 as { label, title }, index}
						<LabelAndTitle
							{label}
							{title}
							underline={shouldUnderline(index, labelData.group5.length)}
						/>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Thumbnail Cover Image -->
	<div class="hidden lg:block label-grid-image">
		{#if book.thumbnailCoverImage}
			<figure class="h-[220px] relative group">
				{#if images.length > 1}
					<button
						on:click={toggleImages}
						on:keydown={(e) => e.key === 'Enter' && toggleImages()}
						class="cursor-pointer block relative w-full h-full"
					>
						<Image imageObject={book.thumbnailCoverImage} fit="contain" />
						<div
							class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center {showImages
								? 'opacity-100'
								: 'opacity-0'} group-hover:opacity-100 transition-opacity duration-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8 text-white-pure"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="1"
							>
								{#if showImages}
									<path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14" />
								{:else}
									<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
								{/if}
							</svg>
						</div>
					</button>
					<LabelAndTitle align="center" label={`${images.length} ${translations.images[lang]}`} />
				{:else}
					<button
						on:click={() => openOverlay(0)}
						on:keydown={(e) => e.key === 'Enter' && openOverlay(0)}
						class="cursor-pointer block relative w-full h-full"
					>
						<Image imageObject={book.thumbnailCoverImage} fit="contain" />
						<div
							class="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-8 w-8 text-white-pure"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
								/>
							</svg>
						</div>
					</button>
					<LabelAndTitle align="center" label={`${images.length} ${translations.image[lang]}`} />
				{/if}
			</figure>
		{/if}
	</div>
</div>

{#if selectedImageIndex !== null}
	<ImageOverlay
		image={images[selectedImageIndex]}
		on:close={closeOverlay}
		on:navigate={({ detail }) => navigateImage(detail)}
		{images}
		currentIndex={selectedImageIndex}
	/>
{/if}

