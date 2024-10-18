<script lang="ts">
  import { page } from '$app/stores';
  import type {MenuItem} from '$lib/types/wp-types'
  export let menuItems:MenuItem[];
  import Button from '$components/Button.svelte';
  import { Hamburger } from 'svelte-hamburgers';
  $: currentPagePath = $page.url.pathname;
  $: currentLanguage = currentPagePath.startsWith('/ar') ? 'ar' : 'en';
  $: otherLanguagePath = currentLanguage === 'ar' 
    ? currentPagePath.replace(/^\/ar/, '/en') 
    : currentPagePath.replace(/^\/en/, '/ar');

  $: menuItems = menuItems.map(item => ({
    ...item,
    // Update 'active' or any other relevant property based on the current path
    current: currentPagePath === item.uri
  }));


  let open:boolean = false;
  

  </script>
<header>
    <div class="fixed top-0 bg-white w-full pt-4 pb-3 z-50">
      <div class="grid md:grid-cols-3 items-center h-full px-4 w-full max-w-screen-xl mx-auto text-black">
        <h1 class="z-30 font-boogy text-xl text-black">Decolonising the page</h1>
        <div class="language-switcher text-center font-martina">
          <a href={currentLanguage === 'en' ? currentPagePath : otherLanguagePath}>English</a>
           | 
          <a class="font-manchette" href={currentLanguage === 'ar' ? currentPagePath : otherLanguagePath}>العربية</a>
        </div>
        <h1 class="text-right z-30 font-manchette font-extrabold text-xl text-black">إنهاء الاستعمار في الصفحة</h1>
      </div>
    </div>
    <nav class="w-full flex px-4 pt-4 justify-between items-center h-12 md:h-24">
      <div class="fixed top-[45vh] z-50"><Hamburger bind:open /></div>
      <ul role="navigation" aria-label="Main" class="fixed w-full items-center h-screen inset-0 z-10 bg-white justify-center flex-row gap-6  {open ? 'flex flex-col' : 'hidden' }" >
        <Button label={"Home"} url={"/"} />
        {#each menuItems as menuItem}
        <li>
        <Button active={menuItem.current} label={menuItem.label} url={menuItem.uri} />
        </li>
        {/each}
      </ul>
    </nav>
  </header> 