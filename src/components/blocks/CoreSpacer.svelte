<script lang="ts">
  import type {EditorBlock} from '$lib/types/wp-types.ts'
  export let block: EditorBlock
  const height:string = block.attributes.height ? block.attributes.height : '5px'
</script>

<div style="height:{height}"></div>
