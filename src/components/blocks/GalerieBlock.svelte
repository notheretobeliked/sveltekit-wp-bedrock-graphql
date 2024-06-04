<script lang="ts">
  export let block: EditorBlock
  const images = block.galerie.galerie.nodes
  import Carousel from '$components/Carousel.svelte';
</script>

<Carousel autoplay={true} images={images} />

