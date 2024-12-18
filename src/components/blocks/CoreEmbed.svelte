<script lang="ts">
	import type { CoreEmbed } from '$lib/graphql/generated'

	export let block: CoreEmbed

	// Convert YouTube watch URL to embed URL
	const getEmbedUrl = (url: string) => {
		const videoId = url.match(
			/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
		)?.[1]
		return videoId ? `https://www.youtube.com/embed/${videoId}` : null
	}

	const embedUrl = getEmbedUrl(block.attributes.url)
</script>

{#if embedUrl}
	<div class="relative w-full pt-[56.25%] mb-4">
		<iframe
			class="absolute top-0 left-0 w-full h-full"
			src={embedUrl}
			title="YouTube video player"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	</div>
{:else}
	<p>Invalid embed URL</p>
{/if}