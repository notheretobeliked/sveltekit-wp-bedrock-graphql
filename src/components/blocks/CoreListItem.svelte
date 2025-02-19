<script lang="ts">
	import type { CoreListItem } from '$lib/graphql/generated'
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		block: CoreListItem
	}

	let { block }: Props = $props()

	const {
		content = '',
		fontSize = 'base',
		textColor = 'black',
		fontFamily = null
	} = block.attributes ?? {}
</script>

<!-- Use the class directive in Svelte to dynamically set classes -->
{#if content}
	<li
		class="{classNames(
			fontSize || 'base',
			textColor || 'black',
            'none',
			fontFamily || 'inter'
		)} mb-4 mx-2 lg:mx-0"
	>
		{@html content}
    </li>
{/if}
