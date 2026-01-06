<script lang="ts">
	import type { CoreEmbed } from '$lib/graphql/generated'
	import { onMount } from 'svelte'

	interface Props {
		block: CoreEmbed
	}

	let { block }: Props = $props()
	let flourishContainer: HTMLDivElement | undefined = $state()

	const getEmbedUrl = (url: string) => {
		// YouTube
		const youtubeId = url.match(
			/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/
		)?.[1]
		if (youtubeId) {
			return `https://www.youtube.com/embed/${youtubeId}`
		}

		// Vimeo
		const vimeoId = url.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1]
		if (vimeoId) {
			return `https://player.vimeo.com/video/${vimeoId}`
		}

		// Dailymotion
		const dailymotionId = url.match(/dailymotion\.com\/(?:video\/)([\w-]+)/)?.[1]
		if (dailymotionId) {
			return `https://www.dailymotion.com/embed/video/${dailymotionId}`
		}

		// SoundCloud
		if (url.includes('soundcloud.com')) {
			return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23ff5500`
		}

		return null
	}

	const checkFlourishEmbed = (url: string) => {
		return url.includes('flourish.studio') || url.includes('flourish-embed')
	}

	let rawUrl = $derived(block.attributes?.url ?? '')
	let embedUrl = $derived(getEmbedUrl(rawUrl) || '')
	let isFlourishEmbed = $derived(checkFlourishEmbed(rawUrl))

	// Handle Flourish embed initialization
	onMount(() => {
		if (isFlourishEmbed && flourishContainer) {
			if (!document.querySelector('script[src="https://public.flourish.studio/resources/embed.js"]')) {
				const script = document.createElement('script')
				script.src = 'https://public.flourish.studio/resources/embed.js'
				script.async = true
				document.head.appendChild(script)
			}
		}
	})
</script>

{#if isFlourishEmbed}
	<div bind:this={flourishContainer} class="w-full mb-4">{@html rawUrl}</div>
{:else if embedUrl !== ''}
	<div
		class="relative w-full {embedUrl.includes('soundcloud.com') ? 'h-[166px]' : 'pt-[56.25%]'} mb-4"
	>
		<iframe
			class="absolute left-0 top-0 h-full w-full"
			src={embedUrl}
			title="Embedded content"
			frameborder="0"
			allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
			allowfullscreen
		></iframe>
	</div>
{:else}
	<p>Invalid embed URL</p>
{/if}
