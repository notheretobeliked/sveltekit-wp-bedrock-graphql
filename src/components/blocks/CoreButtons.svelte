<script lang="ts">
  import CoreButton from '$components/blocks/CoreButton.svelte'
  import type { CoreButtonsBlock } from '$lib/types/wp-types'
  export let block: CoreButtonsBlock
  const children = block.children
  const bgColor = block.attributes.backgroundColor ?? 'white'
  const { justifyContent } = block.attributes.layout

  // Utility to generate CSS classes based on justifyContent value
  function justifyContentClass(justifyContent: 'space-between' | 'left' | 'right' | 'center'): string {
    switch (justifyContent) {
      case 'left':
        return 'justify-start'
      case 'center':
        return 'justify-center'
      case 'right':
        return 'justify-end'
      case 'space-between':
        return 'justify-between'
      default:
        return ''
    }
  }
</script>

<div class="px-2 md:px-0">
  <div class={`m-auto flex ${justifyContentClass(justifyContent)} ${bgColor === 'black' ? '!text-white' : ''}`}>
    {#each children as block, index}
      <CoreButton block={block} />
    {/each}
  </div>
</div>
