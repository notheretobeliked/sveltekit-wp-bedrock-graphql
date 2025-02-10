<script lang="ts">
	/*
    this is a generic button 
  */
	export let label: string = 'Read more'
	export let url: string = '/'
	import { language } from '$stores/language'
	export let active: boolean = false
	export let textClass: string = 'text-base'
	export let fullWidth: boolean = false
	export let colourClass: string = 'bg-white' // Assuming this is a default style
	export let textColourClass: string = 'text-black' // Assuming this is a default style
	$: colourClass = active ? 'bg-black text-white-pure' : 'bg-white-off'
	function handleClick(event: MouseEvent) {
		if (url === '#') {
			event.preventDefault()
		}
	}
</script>

<a
	href={url}
	on:click={handleClick}
	on:click
	class="{colourClass} rounded-lg border-black transition-all duration-500 hover:bg-black hover:text-white-pure hover:border-white py-2 px-4 border-white border {textClass} {textColourClass} {$language ===
	'ar'
		? 'font-lyon'
		: 'font-martina'} cursor-pointer {fullWidth ? 'w-full block text-center' : 'inline'}"
	role="button"
>
	{label}
</a>
