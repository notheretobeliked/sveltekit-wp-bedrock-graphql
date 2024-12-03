<script lang="ts">
	/*
    this is a generic button 
  */
	export let label: string = 'Read more'
	export let url: string = '/'
	export let active: boolean = false
	export let textClass: string = 'text-base'
	export let colourClass: string = 'bg-white' // Assuming this is a default style
	export let textColourClass: string = 'text-black' // Assuming this is a default style
	if (active) colourClass = 'bg-black text-white-pure'
	function handleClick(event: MouseEvent) {
		if (url === '#') {
			event.preventDefault()
		}
	}
</script>

<a
	href={url}
	on:click={handleClick}
	class="{colourClass} rounded-lg border-black transition-all duration-500 hover:bg-black hover:text-white-pure hover:border-white py-2 px-4 border-white border {textClass} {textColourClass} font-martina cursor-pointer"
	role="button"
>
	{label}
</a>
