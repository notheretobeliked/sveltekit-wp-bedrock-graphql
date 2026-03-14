<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreSpacerAttributes } from '$lib/graphql/generated'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CoreSpacerAttributes | undefined)

	let height = $derived(attrs?.height ?? '5px')
</script>

<div style="height:{height}"></div>
