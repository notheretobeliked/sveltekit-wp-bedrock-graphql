<script lang="ts">
	import type { ExhibitionRoom } from '$lib/graphql/generated'
	export let block: ExhibitionRoom
	console.log(block)
	import CoreHeading from './CoreHeading.svelte'
	import CoreParagraph from './CoreParagraph.svelte'
	import Image from '$components/Image.svelte'
    import BlockRenderer from '$components/BlockRenderer.svelte';

</script>

<div class="w-full alignfull">

    {#each block.children as block}
    {#if block}
        <BlockRenderer {block} />
    {/if}
{/each}
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
										level: 2
									}
								}}
							/>
						{/if}
						{#if cabinet.nameAr}
							<CoreHeading
								block={{
									attributes: {
										content: cabinet.nameAr,
										level: 2,
										align: 'right'
									}
								}}
							/>
						{/if}
					</div>

					{#if cabinet.introText}
						<CoreParagraph
							block={{
								attributes: {
									content: cabinet.introText
								}
							}}
						/>
					{/if}

					{#if cabinet.groups}
						{#each cabinet.groups as group}
							{#if group}
								<div class="flex flex-row flex-wrap gap-2 mb-6">
									{#if group.images?.nodes}
										{#each group.images.nodes as image}
											<div class="relative w-48">
												<Image imageObject={image} imageSize="medium" fit="contain" />
												{#if image.reference}
													<div class="mt-2 text-sm text-gray-600">
														{image.reference}
													</div>
												{/if}
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
