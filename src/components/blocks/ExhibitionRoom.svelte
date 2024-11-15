<script lang="ts">
	import type { ExhibitionRoom } from '$lib/graphql/generated'
	export let block: ExhibitionRoom
	console.log(block)
	import CoreHeading from './CoreHeading.svelte'
	import CoreParagraph from './CoreParagraph.svelte'
	import Image from '$components/Image.svelte'
	import BlockRenderer from '$components/BlockRenderer.svelte'
	import { activeBook } from '$stores/activeBook'

	const handleImageClick = (reference: string) => {
		if (!reference) return
		$activeBook = reference
		console.log('Set active book reference:', reference)
	}
</script>

<div class="w-full flex flex-row">
	<div class="images">
		<header class="mb-[200px]">
			{#if block.exhibitionRoom.nameAr}
				<CoreHeading
					block={{
						attributes: {
							content: block.exhibitionRoom.nameAr,
							level: 1,
							fontSize: '4xl',
							textColor: null,
							textAlign: 'center',
							fontFamily: 'manchette',
                            className: '!mb-0'
						}
					}}
				/>
			{/if}
			{#if block.exhibitionRoom.nameEn}
				<CoreHeading
					block={{
						attributes: {
							content: block.exhibitionRoom.nameEn,
							level: 1,
							fontSize: '4xl',
							textColor: null,
							textAlign: 'center',
							fontFamily: null
						}
					}}
				/>
			{/if}
		</header>

		{#if block?.exhibitionRoom?.cabinets}
			{#each block.exhibitionRoom.cabinets as cabinet}
				{#if cabinet}
					<div class="mb-8">
						<div class="mb-4">
							{#if cabinet.nameEn}
								<CoreHeading
									block={{
										attributes: {
											content: cabinet.nameEn,
											level: 1,
											fontSize: null,
											textColor: null,
											textAlign: 'center',
											fontFamily: null
										}
									}}
								/>
							{/if}
							{#if cabinet.nameAr}
								<CoreHeading
									block={{
										attributes: {
											content: cabinet.nameAr,
											level: 1,
											fontSize: null,
											textColor: null,
											textAlign: 'center',
											fontFamily: 'manchette'
										}
									}}
								/>
							{/if}
						</div>

						{#if cabinet.introText}
							<div class="basestyles">
								{@html cabinet.introText}
							</div>
						{/if}

						{#if cabinet.groups}
							{#each cabinet.groups as group}
								{#if group}
									<div class="flex flex-row flex-wrap gap-2 mb-[200px]">
										{#if group.images?.nodes}
											{#each group.images.nodes as image}
												<div
													class="relative w-[10vw]"
													on:click={() => handleImageClick(image.reference)}
													role="button"
													tabindex="0"
													class:cursor-pointer={image.reference}
												>
													<Image imageObject={image} imageSize="thumbnail" shadow fit="contain" />
												</div>
											{/each}
										{/if}
									</div>
								{/if}
							{/each}
						{/if}
					</div>
				{/if}
			{/each}
		{/if}
	</div>
	<div class="fixed text max-w-[500px] bg-white-off right-0 h-screen">
		{#if block.exhibitionRoom.nameEn}
			<CoreHeading
				block={{
					attributes: {
						content: block.exhibitionRoom.nameEn,
						level: 1,
						fontSize: null,
						textColor: null,
						textAlign: 'center',
						fontFamily: null
					}
				}}
			/>
		{/if}
		{#if block.exhibitionRoom.nameAr}
			<CoreHeading
				block={{
					attributes: {
						content: block.exhibitionRoom.nameAr,
						level: 1,
						fontSize: null,
						textColor: null,
						textAlign: 'center',
						fontFamily: 'manchette'
					}
				}}
			/>
		{/if}

		{#if block.exhibitionRoom.introText}
			<div class="basestyles">
				{@html block.exhibitionRoom.introText}
			</div>
		{/if}
	</div>
</div>

<style lang="postcss">
	:global(.basestyles p) {
		@apply text-sm md:text-base font-martina;
	}
</style>
