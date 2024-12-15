<!-- [lang]/library/[ref]/+page.svelte -->
<script lang="ts">
    import LibraryPage from '../+page.svelte';
	import type { PageData } from './$types'
	export let data: PageData

</script>

<LibraryPage {...$$props} />