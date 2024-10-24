<script lang="ts">
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import type { MenuItem } from '$lib/types/wp-types'
	import Button from '$components/Button.svelte'
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
</script>

<header>
	<div class="fixed top-0 bg-white-pure w-full pt-4 pb-3 z-50">
		<div
			class="grid md:grid-cols-3 items-center h-full px-4 w-full max-w-screen-xl mx-auto text-black"
		>
			<h1 class="z-30 font-boogy text-xl text-black">Decolonising the page</h1>
			<div class="language-switcher text-center font-martina">
				<a href={englishLanguagePath} on:click={(e) => switchLanguage(e, englishLanguagePath)}
					>English</a
				>
				|
				<a href={arabicLanguagePath} on:click={(e) => switchLanguage(e, arabicLanguagePath)}
					>العربية</a
				>
			</div>
			<h1 class="text-right z-30 font-manchette font-extrabold text-xl text-black">
				إنهاء الاستعمار في الصفحة
			</h1>
		</div>
	</div>
	<nav class="w-full flex px-4 pt-4 justify-between items-center h-12 md:h-24">
		<div class="fixed top-[45vh] z-50"><Hamburger bind:open /></div>
		<ul
			role="navigation"
			aria-label="Main"
			class="fixed w-full items-center h-screen inset-0 z-30 bg-white-pure justify-center flex-row gap-6 {open
				? 'flex flex-col'
				: 'hidden'}"
		></ul>
	</nav>
</header>
