<script lang="ts">
  import { page } from '$app/stores';
  import type {MenuItem} from '$lib/types/wp-types'
  export let menuItems:MenuItem[];
  import Button from '$components/Button.svelte';
  import { Hamburger } from 'svelte-hamburgers';
  $: currentPagePath = $page.url.pathname;
  $: menuItems = menuItems.map(item => ({
    ...item,
    // Update 'active' or any other relevant property based on the current path
    current: currentPagePath === item.uri
  }));


  let open:boolean = false;
  

  </script>
<header>
    
    <nav class="w-full flex px-4 pt-4 justify-between items-center h-12 md:h-24">
      <a href="/" class="z-30">Home</a>
      <div class="block md:hidden z-50"><Hamburger bind:open /></div>
      <ul role="navigation" aria-label="Main" class="fixed w-full items-center md:static  md:content-center md:flex-wrap h-screen md:h-24 inset-0 z-10 bg-nhtbl-green-base md:bg-transparent justify-center md:flex flex-row gap-6 md:justify-end {open ? 'flex flex-col' : 'hidden' }" >
        {#each menuItems as menuItem}
        <li>
        <Button active={menuItem.current} label={menuItem.label} url={menuItem.uri} />
        </li>
        {/each}
      </ul>
    </nav>
  </header> 