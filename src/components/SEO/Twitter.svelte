<script lang="ts">
  /*
    This component ingests an object containing the data from YoastSeO and outputs twitter specific Opengraph tags
  */
  import type { ImageObject } from '$lib/types/wp-types'
  interface Props {
    image: ImageObject | undefined | null;
    metadescription: string;
    pageTitle: string;
    siteUrl: string;
  }

  let {
    image,
    metadescription,
    pageTitle,
    siteUrl
  }: Props = $props();

  // Helper function to select an image size, defaults to 'large' or the first available size
  function selectImageSize(sizes, preferredSize = 'large') {
    return sizes.find(size => size.name === preferredSize) || sizes[0]
  }

  // Use optional chaining (?) and nullish coalescing (??) operators to safely access properties
  let imageUrl = $derived(image ? selectImageSize(image.mediaDetails.sizes ?? []).sourceUrl ?? undefined : undefined)

</script>

<svelte:head>
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={metadescription} />
  <meta name="twitter:url" content={siteUrl} />
  {#if image}
    <meta name="twitter:image" content={imageUrl} />
    <meta name="twitter:image:alt" content={image.altText} />
  {/if}
</svelte:head>
