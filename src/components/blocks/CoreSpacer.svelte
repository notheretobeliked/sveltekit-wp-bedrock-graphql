<script lang="ts">
	import type { CoreSpacer } from '$lib/graphql/generated'

	interface Props {
		block: CoreSpacer
	}

	let { block }: Props = $props()

	let height = $derived(block.attributes?.height ?? '5px')
</script>

<div style="height:{height}"></div>
