<script lang="ts">
  export let block: EditorBlock
  import BlockRenderer from '$components/BlockRenderer.svelte'
  const columns = block.children.length
  
</script>

<div class="grid md:grid-cols-{columns} gap-7 mb-7">
  {#each block.children as block, index}
    <BlockRenderer {block} />
  {/each}
</div>
