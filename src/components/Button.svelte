<script lang="ts">
	/*
    this is a generic button 
  */
  export let label: string = 'Read more';
  export let url: string = '/';
  export let active: boolean = false
  export let textClass: string = "text-base";
  export let colourClass: string = "bg-black"; // Assuming this is a default style
  export let textColourClass: string = "text-white-pure"; // Assuming this is a default style
  if (active) colourClass = "bg-black text-white-pure"
  
</script>

<a href={url} class="{colourClass} rounded-full transition-all duration-500 hover:bg-black hover:text-white-pure hover:border-white py-2 px-4 border-white border {textClass} {textColourClass} font-sans cursor-pointer" role="button">
  {label}
</a>