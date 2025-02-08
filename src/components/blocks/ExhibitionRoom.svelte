<script lang="ts">
	import { onDestroy, onMount } from 'svelte'
	import type { AcfExhibitionRoom, MediaItem } from '$lib/graphql/generated'
	import type { ObserverEventDetails, ScrollDirection, Options } from 'svelte-inview'
	import { language } from '$stores/language'

	import { fade } from 'svelte/transition'
	export let block: AcfExhibitionRoom
	import CoreHeading from './CoreHeading.svelte'
	import Image from '$components/Image.svelte'
	import { activeBook } from '$stores/activeBook'
	import { inview } from 'svelte-inview'
	let isInView: boolean
	let scrollDirection: Direction | undefined // Update this line
	// Process groups to update layout based on aspect ratio
	// Process groups to update layout based on aspect ratio

	if (block?.exhibitionRoom?.cabinets) {
		block.exhibitionRoom.cabinets.forEach((cabinet) => {
			if (cabinet?.groups) {
				cabinet.groups?.forEach((group) => {
					if (!group || !group.layout) return

					if (group?.layout[0] === 'organic' && group.images?.nodes?.[0]) {
						// Skip landscape check if there are only 2 images
						if (group.images.nodes.length <= 2) return

						const firstImage = group.images.nodes[0]
						const largeSize = firstImage.mediaDetails?.sizes?.find(
							(size) => size && size.name === 'large'
						)

						if (largeSize?.width && largeSize?.height) {
							const firstAspectRatio = parseInt(largeSize.width) / parseInt(largeSize.height)

							// Only check for landscape if first image is landscape
							if (firstAspectRatio > 1) {
								// Check next two images if they exist
								const nextImages = group.images.nodes.slice(1, 3) as MediaItem[]
								const isLandscapeBook = nextImages.some((image) => {
									const imgLargeSize = image?.mediaDetails?.sizes?.find(
										(size) => size?.name === 'large'
									)
									if (imgLargeSize?.width && imgLargeSize?.height) {
										const aspectRatio = parseInt(imgLargeSize.width) / parseInt(imgLargeSize.height)
										// Much higher threshold for spread images
										return aspectRatio > 1.8 // This means it's likely a true landscape book
									}
									return false
								})

								if (isLandscapeBook) {
									group.layout[0] = 'organic-landscape'
								}
							}
						}
					}
				})
			}
		})
	}
	const options: Options = {
		rootMargin: '-50px',
		unobserveOnEnter: true
	}

	const handleCabinetLinkClick = (e: Event, cabinetId: string) => {
		e.preventDefault()
		if (cabinetId === '#') {
			window.scrollTo({ top: 0, behavior: 'smooth' })
		} else {
			const element = document.getElementById(`images-cabinet-${cabinetId}`)
			if (element) {
				element.scrollIntoView({ behavior: 'smooth' })
			}
		}
	}

	const handleChange = ({ detail }: CustomEvent<ObserverEventDetails>) => {
		isInView = detail.inView
		scrollDirection = detail.scrollDirection.vertical
	}

	const handleHeaderInView = ({ detail }: CustomEvent<ObserverEventDetails>) => {
		if (detail.inView) {
			lastVisibleSection = 'room-intro'
			const introElement = document.getElementById('room-intro')
			if (introElement && isInfoOpen) {
				introElement.scrollIntoView({ behavior: 'smooth' })
			}
		}
	}

	const handleCabinetInView =
		(cabinetId: string) =>
		({ detail }: CustomEvent<ObserverEventDetails>) => {
			if (detail.inView) {
				lastVisibleSection = `text-${cabinetId}`
				const textElement = document.getElementById(`text-${cabinetId}`)
				if (textElement && isInfoOpen) {
					textElement.scrollIntoView({ behavior: 'smooth' })
				}
			}
		}
	// Add interval for animation
	let animationInterval: ReturnType<typeof setInterval>

	let currentImageIndex = 0
	let previousImageIndex = 0

	const startAnimation = (nodes: any[]) => {
		if (animationInterval) clearInterval(animationInterval)
		animationInterval = setInterval(() => {
			previousImageIndex = currentImageIndex
			currentImageIndex = (currentImageIndex + 1) % nodes.length
		}, 2000) // Changed to 3 seconds to give time for fade
	}

	import { fly } from 'svelte/transition'

	let infoDiv: HTMLElement
	let isInfoOpen = false
	let lastVisibleSection: string = 'room-intro' // Default to room intro

	let buttonPosition: number

	const updateButtonPosition = () => {
		if (infoDiv) {
			const rect = infoDiv.getBoundingClientRect()
			buttonPosition = rect.left
		}
	}

	const toggleInfo = () => {
		isInfoOpen = !isInfoOpen
		if (isInfoOpen) {
			setTimeout(() => {
				const element = document.getElementById(lastVisibleSection)
				if (element) {
					element.scrollIntoView({ behavior: 'smooth' })
				}
			}, 50) // Slightly longer than the fly transition duration (800ms)
		}
	}

	// Clean up interval on component destroy

	onDestroy(() => {
		if (animationInterval) clearInterval(animationInterval)
	})

	onMount(() => {
		updateButtonPosition()
		window.addEventListener('resize', updateButtonPosition)
		return () => window.removeEventListener('resize', updateButtonPosition)
	})

	const handleImageClick = (reference: string) => {
		if (!reference) return
		$activeBook = reference
		console.log('Set active book reference:', reference)
	}
</script>

<div class="w-full flex flex-row">
	<div class="images">
		<header
			class="mb-[200px] mt-[200px]"
			use:inview={{
				rootMargin: '0px 0px -80% 0px', // Triggers when header is near top
				unobserveOnEnter: false
			}}
			on:inview_change={handleHeaderInView}
		>
			{#if block?.exhibitionRoom?.nameAr}
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
			{#if block?.exhibitionRoom?.nameEn  && $language != 'ar'}
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
			{#each block.exhibitionRoom.cabinets as cabinet, cabinetIndex}
				{#if cabinet}
					<div
						class="mb-8"
						id="images-cabinet-{cabinet.nameEn?.toLowerCase().replace(/\s+/g, '_')}"
						use:inview={{
							rootMargin: '-20% 0px -60% 0px', // Adjust these values to control when the scroll triggers
							unobserveOnEnter: false // Keep observing to handle scrolling back up
						}}
						on:inview_change={handleCabinetInView(
							`cabinet-${cabinet.nameEn?.toLowerCase().replace(/\s+/g, '_')}`
						)}
					>
						<header class="mb-12 top-[20vh] z-30">
							{#if cabinet.nameAr }
								<CoreHeading
									block={{
										attributes: {
											content: cabinet.nameAr,
											level: 1,
											fontSize: null,
											textColor: null,
											textAlign: 'center',
											fontFamily: 'manchette',
											className: '!mb-0'
										}
									}}
								/>
							{/if}
							{#if cabinet.nameEn && $language != 'ar'}
								<CoreHeading
									block={{
										attributes: {
											content: cabinet.nameEn,
											level: 1,
											fontSize: null,
											textColor: null,
											textAlign: 'center',
											fontFamily: 'boogy'
										}
									}}
								/>
							{/if}
						</header>

						{#if cabinet.introText}
							<div class="basestyles {$language === 'ar' ? 'ar' : ''} hidden">
								>
								{@html cabinet.introText}
							</div>
						{/if}

						{#if cabinet.groups}
							{#each cabinet.groups as group, groupIndex}
								{#if group}
									{#if group.layout[0] === 'miniatures'}
										<div
											class="flex flex-row flex-wrap gap-2 mb-[200px] justify-center layout-miniatures"
											use:inview={cabinetIndex === 0 && groupIndex === 0 ? undefined : options}
											on:inview_change={cabinetIndex === 0 && groupIndex === 0
												? undefined
												: handleChange}
										>
											{#if group.images?.nodes}
												{#each group.images.nodes as image, i}
													<div
														class="relative w-[180px] hover:scale-105 transition-all duration-500 {cabinetIndex ===
															0 && groupIndex === 0
															? 'scale-100 opacity-100 translate-y-0'
															: isInView
																? 'scale-100 opacity-100 translate-y-0'
																: 'scale-100 opacity-100 translate-y-0'}"
														on:click={() => handleImageClick(image.reference)}
														role="button"
														tabindex="0"
														class:cursor-pointer={image.reference}
													>
														<Image
															imageObject={image}
															imageSize="thumbnail"
															shadow={group.shadow}
															fit="contain"
														/>
													</div>
												{/each}
											{/if}
										</div>
									{/if}

									{#if group.layout[0] === 'centered'}
										<div
											class="flex flex-col gap-[200px] mb-100 lg:mb-[200px] items-center layout-centered"
											use:inview={options}
											on:inview_change={handleChange}
										>
											{#if group.images?.nodes}
												{#each group.images.nodes as image, i}
													<div
														class="relative h-[300px] lg:h-[527px] hover:scale-[101%] transition-all duration-200 {isInView
															? 'scale-100 opacity-100 translate-y-0'
															: 'scale-100 opacity-100 translate-y-0'}"
														on:click={() => handleImageClick(image.reference)}
														role="button"
														tabindex="0"
														class:cursor-pointer={image.reference}
													>
														<Image
															imageObject={image}
															imageSize="large"
															fit="contain"
															shadow={group.shadow}
														/>
													</div>
												{/each}
											{/if}
										</div>
									{/if}

									{#if group.layout[0] === 'animation'}
										<div class="flex flex-col mt-[200px] mb-[200px] items-center layout-centered">
											{#if group.images?.nodes?.length > 0}
												<div class="relative h-[300px] lg:h-[527px] w-full lg:max-w-[800px]">
													{#key previousImageIndex}
														<div class="absolute inset-0 flex justify-center w-full h-full z-10">
															<div class="relative h-full flex justify-center">
																<Image
																	imageObject={group.images.nodes[previousImageIndex]}
																	imageSize="large"
																	fit="contain"
																/>
															</div>
														</div>
													{/key}
													{#key currentImageIndex}
														<div
															class="absolute inset-0 flex justify-center w-full h-full z-20"
															transition:fade={{ duration: 200 }}
															on:click={() =>
																handleImageClick(group.images.nodes[currentImageIndex]?.reference)}
															role="button"
															tabindex="0"
															class:cursor-pointer={group.images.nodes[currentImageIndex]
																?.reference}
														>
															<div class="relative h-full flex justify-center">
																<Image
																	imageObject={group.images.nodes[currentImageIndex]}
																	imageSize="large"
																	fit="contain"
																/>
															</div>
														</div>
													{/key}
												</div>
												{#if !animationInterval}
													{@const _ = startAnimation(group.images.nodes)}
												{/if}
											{/if}
										</div>
									{/if}

									{#if group.layout[0] === 'organic' || group.layout[0] === 'organic-landscape'}
										<div class="lg:grid lg:grid-cols-2 gap-4 mb-[200px] layout-{group.layout[0]}">
											{#if group.images?.nodes?.length > 0}
												<!-- First image -->
												<div class="lg:col-span-2 flex justify-center">
													<div
														class="{group.layout[0] === 'organic-landscape'
															? 'h-[250px]'
															: 'h-[300px] lg:h-[430px]'} hover:scale-[101%] transition-all duration-200"
														on:click={() => handleImageClick(group.images.nodes[0]?.reference)}
														role="button"
														tabindex="0"
														class:cursor-pointer={group.images.nodes[0]?.reference}
													>
														<Image
															imageObject={group.images.nodes[0]}
															imageSize="large"
															fit="contain"
															shadow={group.shadow}
														/>
													</div>
												</div>

												<!-- For 2 images, show the second image centered -->
												{#if group.images.nodes.length === 2}
													<div class="lg:col-span-2 flex justify-center">
														<div
															class="lg:mt-[50px] {group.layout[0] === 'organic-landscape'
																? 'h-[250px]'
																: 'h-[300px] lg:h-[430px]'} hover:scale-[101%] transition-all duration-200"
															on:click={() => handleImageClick(group.images.nodes[1]?.reference)}
															role="button"
															tabindex="0"
															class:cursor-pointer={group.images.nodes[1]?.reference}
														>
															<Image
																imageObject={group.images.nodes[1]}
																imageSize="large"
																fit="contain"
																shadow={group.shadow}
															/>
														</div>
													</div>
													<!-- For 3 images, show remaining images in alternating layout -->
												{:else if group.images.nodes.length === 3}
													{#each group.images.nodes.slice(1) as image, i}
														{#if i % 2 === 0}
															<div class="lg:col-start-1 lg:row-span-2 flex justify-end">
																<div
																	class="{group.layout[0] === 'organic-landscape'
																		? 'h-[250px]'
																		: 'h-[300px] lg:h-[430px]'} hover:scale-[101%] transition-all duration-200"
																	on:click={() => handleImageClick(image?.reference)}
																	role="button"
																	tabindex="0"
																	class:cursor-pointer={image?.reference}
																>
																	<Image
																		imageObject={image}
																		imageSize="large"
																		fit="contain"
																		shadow={group.shadow}
																	/>
																</div>
															</div>
															<div class="hidden lg:block col-start-2 row-span-1">
																<div class="h-[200px]" />
															</div>
														{:else}
															<div
																class="col-start-2 lg:row-span-2 flex justify-center lg:justify-start"
															>
																<div
																	class="{group.layout[0] === 'organic-landscape'
																		? 'h-[250px]'
																		: 'h-[300px] lg:h-[430px]'} hover:scale-[101%] transition-all duration-200"
																	on:click={() => handleImageClick(image?.reference)}
																	role="button"
																	tabindex="0"
																	class:cursor-pointer={image?.reference}
																>
																	<Image
																		shadow={group.shadow}
																		imageObject={image}
																		imageSize="large"
																		fit="contain"
																	/>
																</div>
															</div>
														{/if}
													{/each}
													<!-- For 4+ images -->
												{:else}
													{#each group.images.nodes.slice(1, -1) as image, i}
														{#if i % 2 === 0}
															<!-- Even indexed images (2nd, 4th, etc.) -->
															<div
																class="lg:col-start-1 lg:row-span-2 flex justify-center lg:justify-end"
															>
																<div
																	class="{group.layout[0] === 'organic-landscape'
																		? 'h-[250px]'
																		: 'h-[300px] lg:h-[430px]'} hover:scale-[101%] transition-all duration-200"
																	on:click={() => handleImageClick(image?.reference)}
																	role="button"
																	tabindex="0"
																	class:cursor-pointer={image?.reference}
																>
																	<Image
																		shadow={group.shadow}
																		imageObject={image}
																		imageSize="large"
																		fit="contain"
																	/>
																</div>
															</div>
															<!-- Spacer -->
															<div class="col-start-2 row-span-1">
																<div class="lg:h-[140px]" />
															</div>
														{:else}
															<!-- Odd indexed images (3rd, 5th, etc.) -->
															<div
																class="col-start-2 lg:row-span-2 flex justify-center lg:justify-start"
															>
																<div
																	class="{group.layout[0] === 'organic-landscape'
																		? 'h-[250px]'
																		: 'h-[300px] lg:h-[430px]'} hover:scale-[101%] transition-all duration-200"
																	on:click={() => handleImageClick(image?.reference)}
																	role="button"
																	tabindex="0"
																	class:cursor-pointer={image?.reference}
																>
																	<Image
																		shadow={group.shadow}
																		imageObject={image}
																		imageSize="large"
																		fit="contain"
																	/>
																</div>
															</div>
															<!-- Spacer -->
															<div class="lg:col-start-1 row-span-1">
																<div
																	class="{group.layout[0] === 'organic-landscape'
																		? 'lg:h-[100px]'
																		: 'lg:h-[140px]'} "
																/>
															</div>
														{/if}
													{/each}

													<!-- Final centered image (only if more than 3 images) -->
													<div class="lg:col-span-2 flex justify-center">
														<div
															class="{group.layout[0] === 'organic-landscape'
																? 'h-[250px]'
																: 'h-[300px] lg:h-[430px]'} hover:scale-[101%] transition-all duration-200"
															on:click={() =>
																handleImageClick(
																	group.images.nodes[group.images.nodes.length - 1]?.reference
																)}
															role="button"
															tabindex="0"
															class:cursor-pointer={group.images.nodes[
																group.images.nodes.length - 1
															]?.reference}
														>
															<Image
																imageObject={group.images.nodes[group.images.nodes.length - 1]}
																imageSize="large"
																fit="contain"
																shadow={group.shadow}
															/>
														</div>
													</div>
												{/if}
											{/if}
										</div>
									{/if}
								{/if}
							{/each}
						{/if}
					</div>
				{/if}
			{/each}
		{/if}
	</div>
	{#if isInfoOpen}
		<div transition:fly={{ x: 500, duration: 800 }} class="fixed right-0 top-0 max-w-[500px] z-30">
			<button
				class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white-pure rounded-full border border-black flex items-center justify-center hover:scale-105 transition-all duration-300 z-40"
				style="left: 0"
				on:click={toggleInfo}
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="transition-transform duration-300 {isInfoOpen ? '' : 'rotate-45'}"
				>
					<path d="M1 1L13 13M1 13L13 1" stroke="black" stroke-width="1" />
				</svg>
			</button>

			<div class="text bg-white-off right-0 top-0 pt-[100px] px-12 overflow-y-scroll h-screen z-30">
				<div class="pt-16" id="room-intro">
					<a href="#" on:click|preventDefault={(e) => handleCabinetLinkClick(e, '#')}>
						{#if block.exhibitionRoom.nameAr}
							<CoreHeading
								block={{
									attributes: {
										content: block.exhibitionRoom.nameAr,
										level: 1,
										fontSize: null,
										textColor: null,
										textAlign: 'center',
										fontFamily: 'manchette',
										className: $language === 'ar' ? 'mb-4' : '!mb-0'
									}
								}}
							/>
						{/if}
						{#if block.exhibitionRoom.nameEn && $language != 'ar'}
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
					</a>
					{#if block.exhibitionRoom.introText}
						<div class="basestyles introtext {$language === 'ar' ? 'ar' : ''}">
							{@html block.exhibitionRoom.introText}
						</div>
					{/if}
				</div>
				{#each block.exhibitionRoom.cabinets as cabinet, i}
					<div
						class="mt-8 pt-24 pb-24 {i === block.exhibitionRoom.cabinets.length - 1
							? 'min-h-screen'
							: ''}"
						id="text-cabinet-{cabinet.nameEn?.toLowerCase().replace(/\s+/g, '_')}"
					>
						<header>
							<a
								href="#images-cabinet-{cabinet.nameEn?.toLowerCase().replace(/\s+/g, '_')}"
								on:click|preventDefault={(e) =>
									handleCabinetLinkClick(e, cabinet.nameEn?.toLowerCase().replace(/\s+/g, '_'))}
							>
								{#if cabinet.nameAr}
									<CoreHeading
										block={{
											attributes: {
												content: cabinet.nameAr,
												level: 1,
												fontSize: 'xl',
												textColor: null,
												textAlign: 'center',
												fontFamily: 'manchette',
												className: $language === 'ar' ? 'mb-2' : '!mb-0'
											}
										}}
									/>
								{/if}
								{#if cabinet.nameEn && $language != 'ar'}
									<CoreHeading
										block={{
											attributes: {
												content: cabinet.nameEn,
												level: 1,
												fontSize: 'xl',
												textColor: null,
												textAlign: 'center',
												fontFamily: null
											}
										}}
									/>
								{/if}
							</a>
						</header>

						{#if cabinet.introText}
							<div class="basestyles {$language === 'ar' ? 'ar' : ''}">
								{@html cabinet.introText}
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div transition:fly={{ x: 500, duration: 500 }}>
			<button
				class="fixed top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 bg-white-pure rounded-full border border-black flex items-center justify-center hover:scale-105 transition-all duration-300 z-40"
				style="right: 0px"
				on:click={toggleInfo}
			>
				<svg
					width="14"
					height="14"
					viewBox="0 0 14 14"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					class="transition-transform duration-300 rotate-45"
				>
					<path d="M1 1L13 13M1 13L13 1" stroke="black" stroke-width="1" />
				</svg>
			</button>
		</div>
	{/if}
</div>

<style lang="postcss">
	:global(.basestyles p) {
		@apply text-sm md:text-base font-martina;
	}

	:global(.basestyles.introtext p) {
		@apply md:text-[1.2rem];
	}

	:global(.basestyles.ar p) {
		@apply text-ar-sm md:text-ar-base font-lyon text-right;
	}

	:global(.basestyles.ar.introtext p) {
		@apply md:text-[1.3rem];
	}
</style>
