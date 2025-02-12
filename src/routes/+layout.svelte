<script lang="ts">
	import '../app.css'
	import { page, navigating } from '$app/stores'
	import type { PageData } from './$types'
	import Twitter from '$components/SEO/Twitter.svelte'
	import OpenGraph from '$components/SEO/OpenGraph.svelte'
	import Header from '$components/Header.svelte'
	import LoadingSpinner from '$components/atoms/LoadingSpinner.svelte'
	import Label from '$components/molecules/label.svelte'
	import { slide } from 'svelte/transition'
	import { activeBook } from '$stores/activeBook'
	import { language } from '$stores/language'
	import { afterNavigate } from '$app/navigation'

	export let data: PageData
	let { seo, menu, uri } = data
	const menuItems = menu.menuItems.nodes
	const image = seo.opengraphImage
	const metadescription = seo.metaDesc
	const pageTitle = seo.title
	const siteUrl = seo.siteUrl
	const siteTitle = seo.opengraphSiteName // Assuming this is used for og:site_name
	let loading = false
	afterNavigate(() => {
		document.documentElement.lang = $language
	})

	$: {
		menuItems
		uri
		seo
	}

	let showModal = false
	let currentBook: string | null = null

	// Watch the activeBook store and find the matching book from page data
	$: if ($activeBook) {
		showModal = true
		loading = true
		fetch(`/api/library-items?ref=${$activeBook}&lang=${$language}`)
			.then((res) => res.json())
			.then((data) => {
				currentBook = data || null
				loading = false
			})
			.catch((error) => {
				console.error('Error fetching book:', error)
				currentBook = null
				loading = false
			})
	}

	function closeModal() {
		showModal = false
		$activeBook = null
	}

	$: $language = $page.params.lang || 'en'
</script>

{#key $page.url.pathname}
	<OpenGraph {image} {metadescription} {pageTitle} {siteTitle} {siteUrl} />
	<Twitter {image} {metadescription} {pageTitle} {siteUrl} />
{/key}

{#key $page.url.pathname}
	<Header />
{/key}

{#if $navigating}
	<div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
		<LoadingSpinner />
	</div>
{/if}

<main class="md:px-0">
	<slot {data} />
</main>

<!-- Add this at the bottom of your template -->
{#if showModal}
	<div class="fixed inset-0 z-50" on:click={closeModal}>
		<div
			class="fixed bottom-0 bg-black w-full z-50 flex items-center justify-center p-4"
			transition:slide={{ duration: 300, axis: 'y' }}
			on:click={closeModal}
			role="dialog"
		>
			<div
				class="text-white-pure mx-auto max-w-screen-xl w-full max-h-[90vh] overflow-y-auto relative lg:overflow-y-visible"
				on:click|stopPropagation
			>
				<div class="flex justify-end mb-4 w-full lg:absolute lg:translate-x-6">
					<button class="text-gray-500 hover:text-gray-700" on:click={closeModal}>
						<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				{#if loading}
					<LoadingSpinner />
				{:else if currentBook}
					<Label book={currentBook} lang={$language} />
				{/if}
			</div>
		</div>
	</div>
{/if}
