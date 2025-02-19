<script lang="ts">
	import { run, createBubbler, handlers } from 'svelte/legacy';

	const bubble = createBubbler();
	
	interface Props {
		/*
    this is a generic button 
  */
		label?: string;
		url?: string;
		active?: boolean;
		textClass?: string;
		fullWidth?: boolean;
		colourClass?: string; // Assuming this is a default style
		textColourClass?: string; // Assuming this is a default style
	}

	let {
		label = 'Read more',
		url = '/',
		active = false,
		textClass = 'text-base',
		fullWidth = false,
		colourClass = $bindable('bg-white'),
		textColourClass = 'text-black'
	}: Props = $props();
	run(() => {
		colourClass = active ? 'bg-black text-white-pure' : 'bg-white-off'
	});
	function handleClick(event: MouseEvent) {
		if (url === '#') {
			event.preventDefault()
		}
	}
</script>

<a
	href={url}
	onclick={handlers(handleClick, bubble('click'))}
	class="{colourClass} rounded-lg border-black transition-all duration-500 hover:bg-black hover:text-white-pure hover:border-white py-2 px-4 border-white border {textClass} {textColourClass} cursor-pointer {fullWidth ? 'w-full block text-center' : 'inline'}"
	role="button"
>
	{label}
</a>
