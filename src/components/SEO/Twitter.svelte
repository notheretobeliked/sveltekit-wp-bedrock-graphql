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
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={pageTitle} />
  <meta name="twitter:description" content={metadescription} />
  <meta name="twitter:url" content={siteUrl} />
  {#if image}
    <meta name="twitter:image" content={imageUrl} />
    <meta name="twitter:image:alt" content={image.altText} />
  {/if}
</svelte:head>
