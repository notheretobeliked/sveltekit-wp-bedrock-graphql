<script lang="ts">
  import { onMount } from 'svelte'
  import type { ACFHomePageHero } from '$lib/types/wp-types'
  export let block:ACFHomePageHero
  const images = block.homePageHero.images.nodes
  const content = block.children
  import BlockRenderer from '$components/BlockRenderer.svelte'
  import Image from '$components/Image.svelte'

  let y: number
  let percentage: number = 100
  let stopAnimationPoint: number
  let pageHeight: number = 3000
  let stopHeight: number = 3000
  let stopped: boolean = false
  let topStart: number = 0

  let transformString: string

  let bgdiv: HTMLDivElement

  onMount(() => {
    pageHeight = 3000 + window.innerHeight
    stopHeight = 3000 - window.innerHeight
    stopAnimationPoint = 3000
    topStart = 3000 - window.innerHeight
  })

  $: {
    percentage = 100 - (y / pageHeight) * 100
    if (y > stopHeight) {
      stopped = true
    } else stopped = false


    if (!stopped) {
      transformString = `transform: scale(${percentage}%)`
    } else transformString = `transform: scale(35%); position:absolute; top:${topStart}px`
  }
</script>

<svelte:window bind:scrollY={y} />
<div class="{stopped ? 'absolute' : 'fixed top-0'} w-full !px-0 h-screen -z-10 top-0" bind:this={bgdiv} style={stopped ? `top:${topStart}px` : ''}>
  {#each images as image, index}
  <div 
  class="absolute top-0 left-0 w-full duration-1000 h-full object-cover transition-all {percentage <= 100 - (100 / images.length) * index &&
    percentage > 100 - (100 / images.length) * (index + 1)
      ? 'opacity-100'
      : 'opacity-0'}">
      <Image imageObject={image} lazy={false} imageSize="medium" fit="cover" />
  </div>
  {/each}
</div>
<div class="h-[3000px] relative">
  <div style={transformString} class="box fixed flex h-screen w-screen items-center justify-center">
    <div class="relative h-screen w-screen bg-nhtbl-green-base my-[5wv] mx-[5wh] flex justify-center items-center p-4 md:p-8 leading-relaxed text-black">
      <div class="max-w-4xl font-serif text-2xl md:text-4xl lg:text-6xl box-container">
        {#each content as block}
          <BlockRenderer {block} />
        {/each}
      </div>
    </div>
  </div>
  <div class="fixed bottom-10 font-serif text-base text-center w-full">
    {#if percentage > 90}
      Scroll for more...
    {:else if percentage > 1 && !stopped}
      <span class="text-white">Keep scrolling...</span>
    {/if}
  </div>
</div>

