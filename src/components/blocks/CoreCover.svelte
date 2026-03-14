<script lang="ts">
	import type { EditorBlock } from '$lib/types/wp-types'
	import type { CoreCoverAttributes } from '$lib/graphql/generated'
	import BlockRenderer from '$components/BlockRenderer.svelte'

	interface Props {
		block: EditorBlock
	}

	let { block }: Props = $props()
	let attrs = $derived(block.attributes as CoreCoverAttributes | undefined)

	let children = $derived(block.children ?? [])
	let url = $derived(attrs?.url ?? '')
	let isDark = $derived(attrs?.isDark ?? false)
	let hasParallax = $derived(attrs?.hasParallax ?? false)
	let textColor = $derived(attrs?.textColor ?? '')
	let backgroundType = $derived(attrs?.backgroundType ?? 'image')
	let gradient = $derived(attrs?.gradient ?? '')
	let hasImage = $derived(backgroundType === 'image' && !!url)

	let focalPoint = $derived.by(() => {
		const raw = attrs?.focalPoint
		if (!raw) return null
		try {
			return typeof raw === 'string' ? JSON.parse(raw) : raw
		} catch {
			return null
		}
	})

	function presetToSpacing(value: string): string | null {
		const match = value.match(/(?:var:preset\|)?spacing\|(\d+)/)
		if (match) return String(parseInt(match[1], 10) / 10)
		return null
	}

	let spacingClasses = $derived.by(() => {
		const raw = attrs?.style
		if (!raw) return { padding: '', gap: '' }
		try {
			const style = typeof raw === 'string' ? JSON.parse(raw) : raw
			const spacing = style?.spacing

			let gap = ''
			if (spacing?.blockGap) {
				const tw = presetToSpacing(spacing.blockGap)
				if (tw) gap = `gap-${tw}`
			}

			const paddingClasses: string[] = []
			const padding = spacing?.padding
			if (padding) {
				const sides = [
					['top', 'pt'],
					['right', 'pr'],
					['bottom', 'pb'],
					['left', 'pl']
				] as const
				for (const [side, prefix] of sides) {
					const val = padding[side]
					if (val) {
						const tw = presetToSpacing(val)
						if (tw) paddingClasses.push(`${prefix}-${tw}`)
					}
				}
			}

			return { padding: paddingClasses.join(' '), gap }
		} catch {
			return { padding: '', gap: '' }
		}
	})

	let paddingClass = $derived(spacingClasses.padding || 'p-4')

	let inlineStyle = $derived.by(() => {
		const parts: string[] = []

		if (hasImage) {
			parts.push(`background-image: url(${url});`)
			if (focalPoint) {
				parts.push(`background-position: ${focalPoint.x * 100}% ${focalPoint.y * 100}%;`)
			}
		} else if (backgroundType === 'gradient' && gradient) {
			parts.push(`background: ${gradient};`)
		}

		const minHeight = attrs?.minHeight
		if (minHeight != null) {
			const unit = attrs?.minHeightUnit ?? 'px'
			parts.push(`min-height: ${minHeight}${unit};`)
		}

		return parts.join(' ')
	})

	let textColorClass = $derived(textColor ? `text-${textColor}` : isDark ? 'text-white' : 'text-black')
</script>

<div
	class="core-cover relative flex items-center justify-center bg-cover h-full {textColorClass} {paddingClass} {spacingClasses.gap} {focalPoint ? '' : 'bg-center'}"
	style={inlineStyle}
	class:bg-fixed={hasParallax}
>
	{#if hasImage}
		<div class="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent"></div>
	{:else if isDark}
		<div class="absolute inset-0 bg-black/50"></div>
	{/if}
	<div class="relative z-10 w-full max-w-screen-xl mx-auto">
		{#each children as childBlock}
			<BlockRenderer block={childBlock} />
		{/each}
	</div>
</div>
