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
		if (active) colourClass = 'bg-black text-white'
	});
	function handleClick(event: Event) {
		if (url === '#') {
			event.preventDefault()
		}
	}
</script>

<a
	href={url}
	onclick={handlers(handleClick, bubble('click'))}
	class="{colourClass} rounded-full transition-all duration-500 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white py-2 px-[2.5rem] border-none {textClass} {textColourClass} cursor-pointer no-underline {fullWidth ? 'w-full block text-center' : 'inline'}"
>
	{label}
</a>
