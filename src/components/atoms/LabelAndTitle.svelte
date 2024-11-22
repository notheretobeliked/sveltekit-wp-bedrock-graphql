<script lang="ts">
	export let underline = false
	export let align: 'center' | 'left' | 'right' = 'left'
	export let label: string
	export let title: string | number | null = null

	const stripHtml = (html: string | number | null) => {
		if (html === null) return null
		const tmp = document.createElement('DIV')
		tmp.innerHTML = String(html)
		return tmp.textContent || tmp.innerText || ''
	}
</script>

<div class="pt-2 pb-3 text-{align} {underline ? 'border-white border-b' : ''}">
	{#if label}
		<p class="text-xs font-martina uppercase tracking-widest mb-1">{label}</p>
	{/if}
	{#if title}
		<p class="text-sm font-martina">{stripHtml(title)}</p>
	{/if}
</div>
