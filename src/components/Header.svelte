<script lang="ts">
	import { onMount } from 'svelte'

	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import { Hamburger } from 'svelte-hamburgers'

	let showToast = false

	$: currentPagePath = $page.url.pathname
	$: currentLanguage = currentPagePath.startsWith('/ar') ? 'ar' : 'en'

	// Update the language path calculations
	$: englishLanguagePath =
		currentPagePath === '/ar/library'
			? '/en/library'
			: currentLanguage === 'ar' && $page.data.translations?.find((t) => t.languageCode === 'en')
				? '/en' + $page.data.translations.find((t) => t.languageCode === 'en').uri
				: '/en'

	$: arabicLanguagePath =
		currentPagePath === '/en/library'
			? '/ar/library'
			: currentLanguage === 'en' && $page.data.translations?.find((t) => t.languageCode === 'ar')
				? '/ar' + $page.data.translations.find((t) => t.languageCode === 'ar').uri
				: '/ar'

	// Add debug logging

	let open: boolean = false

	async function handleShare() {
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Decolonizing the page',
					url: window.location.href
				})
			} catch (error) {
				console.log('Error sharing:', error)
			}
		} else {
			try {
				await navigator.clipboard.writeText(window.location.href)
				showToast = true
				setTimeout(() => (showToast = false), 2000) // Hide after 2 seconds
			} catch (error) {
				console.log('Error copying to clipboard:', error)
			}
		}
	}

	function switchLanguage(event: Event, targetPath: string) {
		if (targetPath !== currentPagePath) {
			event.preventDefault()
			goto(targetPath)
		}
	}

	onMount(() => {
		const topBar = document.getElementById('top-bar')
		if (topBar) {
			const height = topBar.offsetHeight
			document.documentElement.style.setProperty('--header-height', `${height}px`)
		}
	})
</script>

<header class="fixed top-0 left-0 w-full z-40">
	<div
		class="fixed top-0 bg-white-pure w-full pt-4 pb-3 z-40 flex flex-row px-1 md:px-3"
		id="top-bar"
	>
		<div class="hidden lg:block relative">
			<svg
				width="20px"
				height="20px"
				viewBox="0 0 20 20"
				on:click={handleShare}
				class="cursor-pointer"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M9 3C9 2.44772 9.44772 2 10 2C10.5523 2 11 2.44772 11 3L11 13.5C11 14.0523 10.5523 14.5 10 14.5C9.44772 14.5 9 14.0523 9 13.5L9 3Z"
					fill="#000000"
				></path>
				<path
					d="M10.6402 2.76826C11.0645 2.41469 11.1218 1.78413 10.7682 1.35985C10.4147 0.935575 9.7841 0.878251 9.35982 1.23181L6.35982 3.73181C5.93554 4.08538 5.87822 4.71594 6.23178 5.14022C6.58535 5.5645 7.21591 5.62182 7.64019 5.26826L10.6402 2.76826Z"
					fill="#000000"
				></path>
				<path
					d="M9.35981 2.76826C8.93553 2.41469 8.87821 1.78413 9.23177 1.35985C9.58534 0.935575 10.2159 0.878251 10.6402 1.23181L13.6402 3.73181C14.0645 4.08538 14.1218 4.71594 13.7682 5.14022C13.4147 5.5645 12.7841 5.62182 12.3598 5.26826L9.35981 2.76826Z"
					fill="#000000"
				></path>
				<path
					d="M13 9C12.4477 9 12 8.55228 12 8C12 7.44772 12.4477 7 13 7H14C15.6233 7 17 8.16491 17 9.69231V17.3077C17 18.8351 15.6233 20 14 20L6 20C4.37672 20 3 18.8351 3 17.3077L3 9.69231C3 8.16491 4.37672 7 6 7H7C7.55228 7 8 7.44772 8 8C8 8.55228 7.55228 9 7 9H6C5.41414 9 5 9.35043 5 9.69231L5 17.3077C5 17.6496 5.41414 18 6 18L14 18C14.5859 18 15 17.6496 15 17.3077L15 9.69231C15 9.35043 14.5859 9 14 9L13 9Z"
					fill="#000000"
				></path>
			</svg>
			{#if showToast}
				<div
					class="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-sm py-1 px-2 rounded whitespace-nowrap"
				>
					Copied to clipboard
				</div>
			{/if}
		</div>

		<div
			class="flex flew-row gap-4 lg:gap-0 lg:grid lg:grid-cols-3 items-center h-full px-4 w-full max-w-screen-xl mx-auto text-black"
		>
			<h1
				class="font-boogy text-lg whitespace-nowrap text-black {currentLanguage === 'ar'
					? 'hidden lg:inline'
					: ''}"
			>
				<a href="/en" class="">Decolonizing the page</a>
			</h1>
			<div class="language-switcher text-right lg:text-center font-martina justify-end w-full">
				<a
					class="{currentLanguage === 'en' ? 'hidden' : ''} lg:inline"
					href={currentLanguage === 'en' ? currentPagePath : englishLanguagePath}
					on:click={(e) =>
						switchLanguage(e, currentLanguage === 'en' ? currentPagePath : englishLanguagePath)}
					>English</a
				>
				<span class="hidden lg:inline">|</span>
				<a
					class="{currentLanguage === 'ar' ? 'hidden' : ''} lg:inline"
					href={currentLanguage === 'ar' ? currentPagePath : arabicLanguagePath}
					on:click={(e) =>
						switchLanguage(e, currentLanguage === 'ar' ? currentPagePath : arabicLanguagePath)}
					>العربية</a
				>
			</div>
			<h1
				class="text-right whitespace-nowrap z-30 !font-manchette font-extrabold text-lg text-black {currentLanguage ===
				'en'
					? 'hidden lg:inline'
					: ''}"
			>
				<a href="/ar">إنهاء الاستعمار في الصفحة</a>
			</h1>
		</div>
		<div class="" style="--padding:0"><Hamburger bind:open /></div>
	</div>
	<nav class="w-full flex px-4 pt-4 justify-between items-center h-12 md:h-24">
		<ul
			role="navigation"
			aria-label="Main"
			class="fixed w-full items-center h-screen inset-0 z-30 bg-white-off justify-center flex-row gap-6 text-black {open
				? 'flex flex-col'
				: 'hidden'}"
		>
			<li>
				<a href="/{currentLanguage}" class="text-center">
					<span class="block !font-manchette text-xl lg:text-2xl"> معرض </span>
					<span class="block font-boogy text-xl lg:text-2xl">Exhibition</span>
				</a>
			</li>
			<li>
				<a href="/{currentLanguage}/library" class="text-center">
					<span class="block !font-manchette text-xl lg:text-2xl">مكتبة </span>
					<span class="block font-boogy text-xl lg:text-2xl">Library</span>
				</a>
			</li>
			<li>
				<a
					href={currentLanguage === 'ar' ? '/ar/ghurfat-al-taallum' : '/en/learning-hub'}
					class="text-center"
				>
					<span class="block !font-manchette text-xl lg:text-2xl">مركز التعلم </span>
					<span class="block font-boogy text-xl lg:text-2xl">Learning hub</span>
				</a>
			</li>
			<li>
				<a href={currentLanguage === 'ar' ? '/ar/man-nahn' : '/en/about'} class="text-center">
					<span class="block !font-manchette text-xl lg:text-2xl">من نحن </span>
					<span class="block font-boogy text-xl lg:text-2xl">About</span>
				</a>
			</li>
		</ul>
	</nav>
</header>
