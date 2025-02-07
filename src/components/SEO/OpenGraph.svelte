<script lang="ts">
  /*
    This component ingests an object containing the data from YoastSeO and outputs meta and Opengraph tags
  */
  import type { ImageObject } from '$lib/types/wp-types'

  // Mark image and squareImage as optional using ? after the type
  export let image: ImageObject | undefined | null
  export let metadescription: string
  export let ogLanguage: string = 'en_UK'
  export let pageTitle: string
  export let siteTitle: string = 'Not here to be liked'
  export let siteUrl: string

  // Helper function to select an image size, defaults to 'large' or the first available size
  function selectImageSize(sizes, preferredSize = 'large') {
    return sizes.find(size => size.name === preferredSize) || sizes[0]
  }

  // Use optional chaining (?) and nullish coalescing (??) operators to safely access properties
  $: imageUrl = image ? selectImageSize(image.mediaDetails.sizes ?? []).sourceUrl ?? undefined : undefined
</script>

<svelte:head>
  <title>{pageTitle}</title>
  <meta name="msapplication-TileColor" content="#da532c">
  <meta name="theme-color" content="#ffffff">
  <meta name="description" content={metadescription} />
  <meta property="og:site_name" content={siteTitle} />
  <meta property="og:locale" content={ogLanguage} />
  <meta property="og:url" content={siteUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:title" content={pageTitle} />
  <meta property="og:description" content={metadescription} />
  <meta property="og:image" content="/decolonizingthepage.jpg" />
  <meta property="og:image:alt" content="Decolonizing the page" />
</svelte:head>
