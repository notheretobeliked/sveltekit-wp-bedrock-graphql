<script lang="ts">
  import type {EditorBlock} from '$lib/types/wp-types.ts'
  interface Props {
    block: EditorBlock;
  }

  let { block }: Props = $props();
  const height:string = block.attributes.height ? block.attributes.height : '5px'
</script>

<div style="height:{height}"></div>
