<script lang="ts">
	import { page } from '$app/stores'
	import { language } from '$stores/language'
	export let underline = false
	export let align: 'center' | 'left' | 'right' = 'left'
	export let label: string
	export let title: string | number | null = null
    $: cleanTitle = title ? String(title).replace(/<[^>]*>/g, '') : null
	export let ref: string | null = null
    
    $: isArabic = $language === 'ar'
    $: finalAlign = align === 'center' ? 'center' : (isArabic ? 'right' : align)
</script>

<div class="pt-2 pb-3 text-{finalAlign} {underline ? 'border-white border-b' : ''}">
	{#if label}
		{#if ref}
			<div class="flex flex-row w-full justify-between">
				<p class="text-{isArabic ? 'ar-xs' : 'xs'} font-martina uppercase tracking-widest mb-1">{label}</p>
				<a
					href="/{$page.data.lang}/library/{ref.toLowerCase()}"
					class="text-{isArabic ? 'ar-xs' : 'xs'} font-martina uppercase tracking-widest mb-1">#</a
				>
			</div>
		{:else}
			<p class="text-{isArabic ? 'ar-xs' : 'xs'} font-martina uppercase tracking-widest mb-1">{label}</p>
		{/if}
	{/if}
	{#if title}
		<p class="text-{isArabic ? 'ar-sm' : 'sm'} font-martina">{cleanTitle}</p>
	{/if}
</div>
