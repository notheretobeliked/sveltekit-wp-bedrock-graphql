/**
 * Extracts Tailwind classes from WordPress block attributes.
 * Used by BlockRenderer (structural blocks) and prose components (unwrapped blocks).
 */

export interface BlockClasses {
	spacingClasses: string
	bgClasses: string
	textColorClasses: string
	alignClasses: string
	borderRadius: string | undefined
	className: string
}

/**
 * Extracts a Tailwind spacing value from a WordPress preset string.
 * After server normalization, format is "spacing|50" → 5 (50 / 10).
 * Also handles raw "var:preset|spacing|50" as a fallback.
 */
export function presetToSpacing(value: string): string | null {
	const match = value.match(/(?:var:preset\|)?spacing\|(\d+)/)
	if (match) return String(parseInt(match[1], 10) / 10)
	return null
}

export function extractBlockClasses(attributes: Record<string, unknown> | undefined): BlockClasses {
	const result: BlockClasses = {
		spacingClasses: '',
		bgClasses: '',
		textColorClasses: '',
		alignClasses: '',
		borderRadius: undefined,
		className: ''
	}

	if (!attributes) return result

	// className
	result.className = (attributes.className as string) ?? ''

	// backgroundColor / textColor
	const bgColor = attributes.backgroundColor as string | undefined
	if (bgColor) result.bgClasses = `bg-${bgColor}`

	const textColor = attributes.textColor as string | undefined
	if (textColor) result.textColorClasses = `text-${textColor}`

	// align
	const align = attributes.align as string | undefined
	if (align === 'full') result.alignClasses = 'alignfull'
	else if (align === 'wide') result.alignClasses = 'alignwide'

	// style (spacing + border radius)
	const raw = attributes.style
	if (raw) {
		try {
			const style = typeof raw === 'string' ? JSON.parse(raw) : raw

			// Spacing
			const spacing = style?.spacing
			if (spacing) {
				const classes: string[] = []
				const sides = [
					['top', 'pt'],
					['right', 'pr'],
					['bottom', 'pb'],
					['left', 'pl']
				] as const

				const padding = spacing.padding
				if (padding) {
					for (const [side, prefix] of sides) {
						const val = padding[side]
						if (val) {
							const tw = presetToSpacing(val)
							if (tw) classes.push(`${prefix}-${tw}`)
						}
					}
				}

				const margin = spacing.margin
				if (margin) {
					const marginSides = [
						['top', 'mt'],
						['right', 'mr'],
						['bottom', 'mb'],
						['left', 'ml']
					] as const
					for (const [side, prefix] of marginSides) {
						const val = margin[side]
						if (val) {
							const tw = presetToSpacing(val)
							if (tw) classes.push(`${prefix}-${tw}`)
						}
					}
				}

				result.spacingClasses = classes.join(' ')
			}

			// Border radius
			result.borderRadius = style?.border?.radius ?? undefined
		} catch {
			// ignore
		}
	}

	return result
}
