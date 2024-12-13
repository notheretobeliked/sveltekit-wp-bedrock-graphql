<script lang="ts">
	export let slug: string | null = null
	export let byline: string | null = null
	export let date: string
	export let title: string
</script>

<div class="w-full flex flex-col gap-4 border-b border-black mb-12">
	{#if slug}
		<a href={slug} class="contents">
			<h1 class="font-boogy text-xl text-center">{title}</h1>
			<div class="grid grid-cols-2">
				<p class="font-martina text-base w-full text-center">{byline}</p>
				<p class="font-martina text-base w-full text-center">{date}</p>
			</div>
		</a>
	{:else}
		<h1 class="font-boogy text-xl text-center">{title}</h1>
		<div class="grid grid-cols-2">
			<p class="font-martina text-base w-full text-center">{byline}</p>
			<p class="font-martina text-base w-full text-center">{date}</p>
		</div>
	{/if}
</div>
