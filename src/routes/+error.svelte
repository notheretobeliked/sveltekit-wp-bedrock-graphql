<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="mt-40 min-h-screen bg-caution max-w-screen-lg mx-auto">
<h1 class="text-[10rem] leading-42 text-extremedanger">{page.status}</h1>
{#if (page.status === 404) }
<p class="text-base mb-3">Apologies, but you seem to be as lost as the government climate policies.</p>
<p class="text-base mb-3">Go back to the <a href="/">homepage</a> to learn more about Heat Strike.</p>
{:else}
<p class="text-base">{page.error.message}</p>
{/if}

</div>