<script lang="ts">
	/*
    this is a generic button 
  */
  export let label: string = 'Read more';
  export let url: string = '/';
  export let active: boolean = false
  export let textClass: string = "text-base";
  export let colourClass: string = "bg-green"; // Assuming this is a default style
  export let textColourClass: string = "text-black"; // Assuming this is a default style
  if (active) colourClass = "bg-black text-white"
  
</script>

<a href={url} class="{colourClass} rounded-full transition-all duration-500 hover:bg-black hover:text-white hover:border-white py-2 px-4 border-black border {textClass} {textColourClass} font-display cursor-pointer" role="button">
  {label}
</a>