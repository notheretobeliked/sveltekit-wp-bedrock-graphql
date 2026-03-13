<script lang="ts">
  /*
    This component ingests an object containing the data from YoastSeO and outputs meta and Opengraph tags
  */
  import type { ImageObject } from '$lib/types/wp-types'

  
  interface Props {
    // Mark image and squareImage as optional using ? after the type
    image: ImageObject | undefined | null;
    metadescription: string;
    ogLanguage?: string;
    pageTitle: string;
    siteTitle?: string;
    siteUrl: string;
  }

  let {
    image,
    metadescription,
    ogLanguage = 'en_UK',
    pageTitle,
    siteTitle = 'Not here to be liked',
    siteUrl
  }: Props = $props();

  // Helper function to select an image size, defaults to 'large' or the first available size
  type ImageSizeEntry = NonNullable<NonNullable<NonNullable<ImageObject['mediaDetails']>['sizes']>[number]>

  function selectImageSize(sizes: ImageSizeEntry[], preferredSize = 'large'): ImageSizeEntry | undefined {
    return sizes.find(size => size.name === preferredSize) || sizes[0]
  }

  let validSizes = $derived(
    image?.mediaDetails?.sizes?.filter((s): s is ImageSizeEntry => s != null) ?? []
  )
  let imageUrl = $derived(validSizes.length > 0 ? selectImageSize(validSizes)?.sourceUrl : undefined)
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
  {#if imageUrl}
    <meta property="og:image" content={imageUrl} />
    <meta property="og:image:alt" content={image?.altText ?? ''} />
  {/if}
</svelte:head>
