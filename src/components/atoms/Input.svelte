<script lang="ts">
	interface Props {
		showLabel?: boolean
		placeholderText?: string
		type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'search' | 'url'
		labelText?: string
	}

	let {
		showLabel = false,
		placeholderText = '',
		type = 'text',
		labelText = ''
	}: Props = $props()
</script>

<label class="flex flex-col gap-1">
	{#if showLabel && labelText}
		<span class="text-sm font-sans">{labelText}</span>
	{/if}
	<input
		{type}
		placeholder={placeholderText}
		class="w-full px-3 py-2 border border-gray-300 text-sm font-sans focus:outline-none focus:border-blue-500 rounded-sm bg-white"
	/>
</label>
