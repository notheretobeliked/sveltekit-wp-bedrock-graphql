<script lang="ts">
	import { onMount } from 'svelte'

	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import type { MenuItem } from '$lib/types/wp-types'
	import { Hamburger } from 'svelte-hamburgers'

	export let menuItems: MenuItem[]

	$: currentPagePath = $page.url.pathname
	$: currentLanguage = currentPagePath.startsWith('/ar') ? 'ar' : 'en'
	$: englishLanguagePath =
		currentLanguage === 'ar' ? currentPagePath.replace(/^\/ar/, '/en') : currentPagePath
	$: arabicLanguagePath =
		currentLanguage === 'en' ? currentPagePath.replace(/^\/en/, '/ar') : currentPagePath

	$: menuItems = menuItems.map((item) => ({
		...item,
		current: currentPagePath === item.uri
	}))

	let open: boolean = false

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
		<div class="hidden lg:block">
			<svg
				width="30"
				height="30"
				viewBox="0 0 30 30"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect width="30" height="30" fill="white" />
				<path d="M23.5 6.5L6.5 14.5L23.5 22.5" stroke="black" stroke-width="2" />
				<circle cx="6.5" cy="14.5" r="3.5" fill="white" stroke="black" stroke-width="2" />
				<circle cx="23.5" cy="6.5" r="3.5" fill="white" stroke="black" stroke-width="2" />
				<circle cx="23.5" cy="22.5" r="3.5" fill="white" stroke="black" stroke-width="2" />
			</svg>
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
					class={currentLanguage === 'en' ? 'hidden lg:inline' : ''}
					href={englishLanguagePath}
					on:click={(e) => switchLanguage(e, englishLanguagePath)}>English</a
				>
				<span class="hidden lg:inline">|</span>
				<a
					class={currentLanguage === 'ar' ? 'hidden lg:inline' : ''}
					href={arabicLanguagePath}
					on:click={(e) => switchLanguage(e, arabicLanguagePath)}>العربية</a
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
					<span class="block !font-manchette text-2xl"> معرض </span>
					<span class="block font-boogy text-2xl">Exhibition</span>
				</a>
			</li>
			<li>
				<a href="/{currentLanguage}/library" class="text-center">
					<span class="block !font-manchette text-2xl">مكتبة </span>
					<span class="block font-boogy text-2xl">Library</span>
				</a>
			</li>
			<li>
				<a href="/{currentLanguage}/learning-hub" class="text-center">
					<span class="block !font-manchette text-2xl">مركز التعلم </span>
					<span class="block font-boogy text-2xl">Learning hub</span>
				</a>
			</li>
			<li>
				<a href="/{currentLanguage}/about" class="text-center">
					<span class="block !font-manchette text-2xl">عن </span>
					<span class="block font-boogy text-2xl">About</span>
				</a>
			</li>
		</ul>
	</nav>
</header>
