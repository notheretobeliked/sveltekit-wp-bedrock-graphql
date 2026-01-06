<script lang="ts">
	interface Props {
		isPreview?: boolean
		lastModified?: string | null
		canEdit?: boolean
	}

	let { isPreview = false, lastModified = null, canEdit = false }: Props = $props()

	function formatTimestamp(timestamp: string | null): string {
		if (!timestamp) return 'Unknown'

		try {
			const date = new Date(timestamp)
			return date.toLocaleString('en-GB', {
				day: '2-digit',
				month: 'short',
				year: 'numeric',
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})
		} catch {
			return timestamp
		}
	}
</script>

{#if isPreview}
	<div class="preview-banner">
		<div class="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between text-sm font-medium">
			<div class="flex items-center gap-3">
				<div class="flex items-center gap-2">
					<svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
					<span class="font-bold">PREVIEW MODE</span>
				</div>

				{#if lastModified}
					<div class="hidden sm:flex items-center gap-1 text-xs opacity-90">
						<svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
						</svg>
						<span>Last modified: {formatTimestamp(lastModified)}</span>
					</div>
				{/if}
			</div>

			<div class="flex items-center gap-2 text-xs">
				<span class="hidden sm:inline opacity-90">This is a preview of unpublished changes</span>
			</div>
		</div>
	</div>

	<!-- Spacer to push content down -->
	<div class="h-12"></div>
{/if}

<style>
	.preview-banner {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		background-color: #fef3c7;
		color: #92400e;
		border-bottom: 2px solid #d97706;
		box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
	}
</style>
