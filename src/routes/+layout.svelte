<script lang="ts">
	import '../app.css'
	import { page, navigating } from '$app/stores'
	import type { LayoutData } from './$types'
	import Twitter from '$components/SEO/Twitter.svelte'
	import OpenGraph from '$components/SEO/OpenGraph.svelte'

	interface Props {
		data: LayoutData;
		children?: import('svelte').Snippet<[any]>;
	}

	let { data, children }: Props = $props();
	let { seo, menu, uri } = data
	const menuItems = menu.menuItems?.nodes
	const image = seo.opengraphImage
	const metadescription = seo.metaDesc
	const pageTitle = seo.title
	const siteUrl = seo.siteUrl
	const siteTitle = seo.opengraphSiteName // Assuming this is used for og:site_name


</script>

{#key $page.url.pathname}
	<OpenGraph {image} {metadescription} {pageTitle} {siteTitle} {siteUrl} />
	<Twitter {image} {metadescription} {pageTitle} {siteUrl} />
{/key}


<main class="md:px-0">
	{@render children?.({ data, })}
</main>
