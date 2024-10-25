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

<header class="fixed top-0 left-0 w-full">
	<div class="fixed top-0 bg-white-pure w-full pt-4 pb-3 z-50" id="top-bar">
		<div
			class="grid md:grid-cols-3 items-center h-full px-4 w-full max-w-screen-xl mx-auto text-black"
		>
			<h1 class="z-30 font-boogy text-lg text-black"><a href="/en">Decolonising the page</a></h1>
			<div class="language-switcher text-center font-martina">
				<a href={englishLanguagePath} on:click={(e) => switchLanguage(e, englishLanguagePath)}
					>English</a
				>
				|
				<a href={arabicLanguagePath} on:click={(e) => switchLanguage(e, arabicLanguagePath)}
					>العربية</a
				>
			</div>
			<h1 class="text-right z-30 font-manchette font-extrabold text-lg text-black">
				<a href="/ar">إنهاء الاستعمار في الصفحة</a>
			</h1>
		</div>
	</div>
	<nav class="w-full flex px-4 pt-4 justify-between items-center h-12 md:h-24">
		<div class="fixed top-[45vh] z-50"><Hamburger bind:open /></div>
		<ul
			role="navigation"
			aria-label="Main"
			class="fixed w-full items-center h-screen inset-0 z-30 bg-white-off justify-center flex-row gap-6 text-black {open
				? 'flex flex-col'
				: 'hidden'}"
		>
			<li>
				<a href="/{currentLanguage}" class="text-center">
					<span class="block font-manchette text-2xl"> معرض </span>
					<span class="block font-boogy text-2xl">Exhibition</span>
				</a>
			</li>
			<li>
				<a href="/{currentLanguage}/library" class="text-center">
					<span class="block font-manchette text-2xl">مكتبة </span>
					<span class="block font-boogy text-2xl">Library</span>
				</a>
			</li>
		</ul>
	</nav>
</header>
