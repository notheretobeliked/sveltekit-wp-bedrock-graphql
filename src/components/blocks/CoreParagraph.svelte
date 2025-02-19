<script lang="ts">
	import type { CoreParagraph } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: CoreParagraph;
	}

	let { block }: Props = $props();

    const {
        content = '',
        fontSize = 'base',
        textColor = 'black',
        align = 'left',
        fontFamily = null
    } = block.attributes ?? {}


</script>

<!-- Use the class directive in Svelte to dynamically set classes -->
{#if content}
	<p
		class="{classNames(
			fontSize || 'base',
			textColor || 'black',
			align || 'left',
			fontFamily || 'inter',
		)} mb-4 mx-2 lg:mx-0"
	>
	{@html content}
</p>

{/if}
