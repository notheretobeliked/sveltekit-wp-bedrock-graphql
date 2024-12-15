<!-- [lang]/library/[ref]/+page.svelte -->
<script lang="ts">
    import LibraryPage from '../+page.svelte';
	import type { PageData } from './$types'
	export let data: PageData
    console.log(data)

</script>

<LibraryPage {...$$props} />