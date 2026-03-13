<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()

	let className = $derived(block.attributes?.className ?? '')
	let format = $derived(block.attributes?.format ?? '')
	let postDate = $derived(block.postDate)

	/**
	 * Convert a PHP date format string to Intl.DateTimeFormat options.
	 * Supports the most common PHP tokens used in WordPress.
	 */
	function phpFormatToIntlOptions(phpFormat: string): Intl.DateTimeFormatOptions {
		const options: Intl.DateTimeFormatOptions = {}

		if (phpFormat.includes('F')) options.month = 'long'
		else if (phpFormat.includes('M')) options.month = 'short'
		else if (phpFormat.includes('m') || phpFormat.includes('n')) options.month = 'numeric'

		if (phpFormat.includes('Y')) options.year = 'numeric'
		else if (phpFormat.includes('y')) options.year = '2-digit'

		if (phpFormat.includes('j') || phpFormat.includes('d')) options.day = 'numeric'

		return options
	}

	let formattedDate = $derived.by(() => {
		if (!postDate) return ''
		const date = new Date(postDate)
		const options: Intl.DateTimeFormatOptions = format
			? phpFormatToIntlOptions(format)
			: { year: 'numeric', month: 'long', day: 'numeric' }
		return date.toLocaleDateString('en-US', options)
	})
</script>

{#if formattedDate}
	<time datetime={postDate} class={className}>
		{formattedDate}
	</time>
{/if}
