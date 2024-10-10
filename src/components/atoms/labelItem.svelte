<script lang="ts">
	export let underline = false
	export let label: string
	export let title: string | number | null = null
</script>

<div class={underline ? 'border-white border-b' : ''}>
	{#if label}
		<p class="text-xs uppercase">{label}</p>
	{/if}
	{#if title}
		<p class="text-base">{title}</p>
	{/if}
</div>
