<script lang="ts">
	import { Hamburger } from 'svelte-hamburgers'
	import { page } from '$app/stores'

	interface MenuItem {
		label?: string | null
		order?: number | null
		uri?: string | null
	}

	interface Props {
		menuItems?: MenuItem[],
		siteTitle: string
	}

	let { menuItems = [], siteTitle = "My website" }: Props = $props()

	// Normalize paths by removing trailing slashes (except for root)
	const normalizePath = (path: string) => {
		if (path === '/') return path
		return path.endsWith('/') ? path.slice(0, -1) : path
	}

	const isCurrent = (itemUri: string | null | undefined) => {
		if (!itemUri) return false
		return normalizePath($page.url.pathname) === normalizePath(itemUri)
	}

	let showToast = $state(false)

	let open: boolean = $state(false)

	async function handleShare() {
		if (navigator.share) {
			try {
				await navigator.share({
					title: siteTitle,
					url: window.location.href
				})
			} catch (error) {
				console.log('Error sharing:', error)
			}
		} else {
			try {
				await navigator.clipboard.writeText(window.location.href)
				showToast = true
				setTimeout(() => (showToast = false), 2000)
			} catch (error) {
				console.log('Error copying to clipboard:', error)
			}
		}
	}
</script>

<a href="#main-content" class="skip-link">Skip to content</a>

<header class="fixed top-0 left-0 w-full z-40">
	<div
		class="fixed top-0 bg-white-pure w-full pt-4 pb-3 z-40 flex flex-row px-1 items-center md:px-3 h-[56px]"
		id="top-bar"
	>
		<div class="hidden lg:block relative">
			<button
				onclick={handleShare}
				class="cursor-pointer bg-transparent border-none p-0"
				aria-label="Share this page"
			>
				<svg
					width="30"
					height="30"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M11.63 8.5H15C15.28 8.5 15.5 8.72 15.5 9V18C15.5 18.28 15.28 18.5 15 18.5H5C4.72 18.5 4.5 18.28 4.5 18V9C4.5 8.72 4.72 8.5 5 8.5H8.25"
						stroke="black"
						stroke-linecap="round"
						stroke-width="0.75"
					/>
					<path
						d="M10 2V14M10 2L13.5 5M10 2L6.5 5"
						stroke="black"
						stroke-linecap="round"
						stroke-width="0.75"
					/>
				</svg>
			</button>

			{#if showToast}
				<div
					class="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-sm py-1 px-2 rounded whitespace-nowrap"
					role="status"
				>
					URL Copied to clipboard
				</div>
			{/if}
		</div>

		<div
			class="flex flew-row gap-4 lg:gap-0 lg:grid lg:grid-cols-3 items-center h-full px-4 w-full max-w-screen-xl mx-auto text-black"
		>
			<h1
				class="text-base whitespace-nowrap text-black text-center">
				<a href="/">{siteTitle}</a>
			</h1>

		</div>
		<div class="" style="--padding:0">
			<Hamburger bind:open ariaLabel="Toggle navigation menu" />
		</div>
	</div>
	<nav aria-label="Main navigation" class="w-full flex px-4 pt-4 justify-between items-center h-12 md:h-24">
		<ul
			class="fixed w-full items-center h-screen inset-0 z-30 bg-white-off justify-center flex-col gap-6 text-black list-none {open
				? 'flex flex-col'
				: 'hidden'}"
		>
			{#each menuItems as item}
				<li>
					<a
						href={item.uri}
						class="text-lg hover:underline focus-visible:underline {isCurrent(item.uri) ? 'font-bold' : ''}"
						aria-current={isCurrent(item.uri) ? 'page' : undefined}
						onclick={() => (open = false)}
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style>
	:global(.hamburger) {
		--layer-height: 1.5px;
	}

	.skip-link {
		position: absolute;
		left: -9999px;
		top: 0;
		z-index: 999;
		padding: 0.5rem 1rem;
		background: black;
		color: white;
		text-decoration: none;
	}

	.skip-link:focus {
		left: 0;
	}
</style>
