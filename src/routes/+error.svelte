<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="mt-40 min-h-[calc(100vh-60vw)] max-w-screen-lg mx-auto px-4">
	<h1 class="text-[10rem] leading-none">{page.status}</h1>
	{#if page.status === 404}
		<p class="text-base mb-3">The page you're looking for doesn't exist.</p>
		<p class="text-base mb-3">Go back to the <a href="/">homepage</a>.</p>
	{:else}
		<p class="text-base">{page.error?.message}</p>
	{/if}
</div>
