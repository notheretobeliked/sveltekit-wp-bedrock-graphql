<script lang="ts">
    import {
        onMount
    } from 'svelte'

    import {
        page
    } from '$app/stores'
    import {
        goto
    } from '$app/navigation'
    import {
        Hamburger
    } from 'svelte-hamburgers'

    let showToast = false

    $: currentPagePath = $page.url.pathname
    $: currentLanguage = currentPagePath.startsWith('/ar') ? 'ar' : 'en'

    // Update the language path calculations
    $: englishLanguagePath =
        currentPagePath === '/ar/library' ?
        '/en/library' :
        currentLanguage === 'ar' && $page.data.translations?.find((t) => t.languageCode === 'en') ?
        '/en' + $page.data.translations.find((t) => t.languageCode === 'en').uri :
        '/en'

    $: arabicLanguagePath =
        currentPagePath === '/en/library' ?
        '/ar/library' :
        currentLanguage === 'en' && $page.data.translations?.find((t) => t.languageCode === 'ar') ?
        '/ar' + $page.data.translations.find((t) => t.languageCode === 'ar').uri :
        '/ar'

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
    <div class="fixed top-0 bg-white-pure w-full pt-4 pb-3 z-40 flex flex-row px-1 items-center md:px-3" id="top-bar">
        <div class="hidden lg:block relative">

            <svg on:click={handleShare} class="cursor-pointer" width="30" height="30" viewBox="0 0 20 20"
                fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M11.63 8.5H15C15.28 8.5 15.5 8.72 15.5 9V18C15.5 18.28 15.28 18.5 15 18.5H5C4.72 18.5 4.5 18.28 4.5 18V9C4.5 8.72 4.72 8.5 5 8.5H8.25"
                    stroke="black" stroke-linecap="round" stroke-width="0.75" />
                <path d="M10 2V14M10 2L13.5 5M10 2L6.5 5" stroke="black" stroke-linecap="round" stroke-width="0.75" />
            </svg>

            {#if showToast}
    <div
     class="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black text-white text-sm py-1 px-2 rounded whitespace-nowrap"
    >
     URL Copied to clipboard
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

<style>
	:global(.hamburger) {
		--layer-height: 2px;
	}
</style>