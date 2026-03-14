<script lang="ts">
	import { classNames } from '$lib/utilities/utilities'

	interface Props {
		label?: string
		url?: string
		linkTarget?: string
		backgroundColor?: string
		textColor?: string
		borderRadius?: string
		fontSize?: string
		fontFamily?: string
		className?: string
	}

	let {
		label = 'Read more',
		url = '/',
		linkTarget,
		backgroundColor = 'white',
		textColor = 'black',
		borderRadius,
		fontSize,
		fontFamily,
		className = ''
	}: Props = $props()

	let bgClass = $derived(`bg-${backgroundColor}`)
	let textClass = $derived(`text-${textColor}`)
	let fontSizeClass = $derived(classNames(fontSize ?? 'base', null, null, null))
	let fontFamilyClass = $derived(fontFamily ? `font-${fontFamily}` : '')
	let paddingClass = $derived(fontSize === 'sm' ? 'py-1 px-[1.5rem]' : 'py-2 px-[2.5rem]')
</script>

<a
	href={url}
	target={linkTarget}
	class="inline-block {paddingClass} border-none no-underline cursor-pointer transition-all duration-500 hover:bg-black hover:text-white focus-visible:bg-black focus-visible:text-white {bgClass} {textClass} {fontSizeClass} {fontFamilyClass} {className}"
	style:border-radius={borderRadius}
>
	{label}
</a>
