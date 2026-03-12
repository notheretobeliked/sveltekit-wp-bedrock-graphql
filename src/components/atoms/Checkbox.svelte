<script lang="ts">
	interface Props {
		labelText?: string
		checked?: boolean
	}

	let { labelText = '', checked = false }: Props = $props()
</script>

<label class="flex items-center gap-2 cursor-pointer">
	<input type="checkbox" bind:checked class="w-4 h-4 accent-blue-500 cursor-pointer" />
	{#if labelText}
		<span class="text-sm font-sans">{labelText}</span>
	{/if}
</label>
