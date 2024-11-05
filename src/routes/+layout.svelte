<script lang="ts">
    import '../app.css'
    import { page, navigating } from '$app/stores'
    import type { PageData } from './$types'
    import Twitter from '$components/SEO/Twitter.svelte'
    import OpenGraph from '$components/SEO/OpenGraph.svelte'
    import Header from '$components/Header.svelte'
    import LoadingSpinner from '$components/atoms/LoadingSpinner.svelte'

    export let data: PageData
    let { seo, menu, uri } = data
  
    const menuItems = menu.menuItems.nodes
    const image = seo.opengraphImage
    const metadescription = seo.metaDesc
    const pageTitle = seo.title
    const siteUrl = seo.siteUrl
    const siteTitle = seo.opengraphSiteName // Assuming this is used for og:site_name
  
    $: {
    menuItems
    uri
    seo
  }
  </script>
  
  {#key $page.url.pathname}
    <OpenGraph {image} {metadescription} {pageTitle} {siteTitle} {siteUrl} />
    <Twitter 
      {image} 
      {metadescription} 
      {pageTitle} 
      {siteUrl} />
  {/key}
  
  
  {#key $page.url.pathname}
  <Header {menuItems} />
  {/key}
  
  
  {#if $navigating}
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <LoadingSpinner />
  </div>
{/if}

<main class="px-3 md:px-0">
  <slot {data}  />
</main>
