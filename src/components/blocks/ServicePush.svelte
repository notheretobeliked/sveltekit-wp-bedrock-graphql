<script lang="ts">
  import type { ACFServicePush, ServiceNode } from '$lib/types/wp-types'
  export let block: ACFServicePush
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import Image from '$components/Image.svelte'

  const uri = block.servicePush.service.nodes[0].uri
  const colour = block.attributes.backgroundColor ?? 'transparent'
</script>

{#each block.servicePush.service.nodes as serviceBlock}
  <div class="group relative bg-{colour} transition-colors hover:bg-nhtbl-purple-base duration-300 px-4 py-8 cursor-pointer">
    <a href={serviceBlock.uri} class="inset-0 flex flex-row gap-4 alignwide ">
      <div class="w-[41.66666667%]">
        <figure class="aspect-[3/2] overflow-hidden relative">
          <Image
            imageObject={serviceBlock.featuredImage.node}
            imageSize='medium'
            fit="cover"
            extraClasses="w-full h-full absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-105 w-full h-full"
          />
        </figure>
      </div>
      <div class="transition-colors duration-300 flex flex-col gap-6 w-full">
        {#each block.children as block}
          <BlockRenderer {block} forceFull />
        {/each}
      </div>
    </a>
  </div>
{/each}
