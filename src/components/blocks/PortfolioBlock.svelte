<script lang="ts">
  import { onMount, onDestroy } from 'svelte'
  import type { ACFPortfolioBlock, PortfolioItemNode } from '$lib/types/wp-types'
  import PortfolioItem from '$components/PortfolioItem.svelte'
  import Button from '$components/Button.svelte'
  import Masonry from 'svelte-bricks'

  export let block: ACFPortfolioBlock
  let items: PortfolioItemNode[] = block.portfolioBlock.portfolioItems.nodes

  let minColWidth = 140 // Default value for mobile screens
  let maxColWidth = 1200
  let gap = 30

  // Reactive statement to update minColWidth based on window width
  $: {
    if (typeof window !== 'undefined') {
      minColWidth = window.innerWidth >= 768 ? 420 : 140 // 768px is a common breakpoint for iPads
    }
  }

  // Resize listener to react to window size changes
  onMount(() => {
    const handleResize = () => {
      minColWidth = window.innerWidth >= 768 ? 420 : 140
    }

    window.addEventListener('resize', handleResize)

    // Cleanup to remove event listener
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })
</script>

<div class="bg-black relative -mb-24">
  <Masonry {items} {minColWidth} {maxColWidth} {gap} idKey="slug" let:item animate>
    <PortfolioItem block={item} noLink />
  </Masonry>
  <div class="absolute bottom-0 h-[100vh] w-full flex flex-col justify-end bg-gradient-to-t from-black to-transparent">
    <div class="flex justify-center">
      <Button textClass="text-xl" url="/portfolio" label="Explore the portfolio" />
    </div>
  </div>
</div>
