<script lang="ts">
  import type { CoreButtonBlock } from '$lib/types/wp-types'
  import Button from '$components/Button.svelte'

  // Expect a core/button block
  export let block: CoreButtonBlock
  const classNames = (fontSize: string | null, textColor: string | null | undefined) => {
    let textClasses = '',
      colorClasses = textColor ? `text-${textColor}` : ''

    switch (fontSize) {
      case 'base':
        textClasses = 'text-sans text-sm md:text-base'
        break
      case 'lg':
        textClasses = 'font-display text-base md:text-lg'
        break
      case 'xl':
        textClasses = 'font-display text-base md:text-lg lg:text-xl'
        break
      case '2xl':
        textClasses = 'font-display text-xl md:text-2xl'
        break
      case null:
        textClasses = 'text-sans text-sm md:text-base'
        break
    }
    colorClasses = `text-${textColor}`

    return `${textClasses} ${colorClasses}` // Combine base classes with spacing classes
  }
</script>

<Button textClass={classNames(block.attributes.fontSize?? null, block.attributes.textColor)} url={block.attributes.url} label={block.attributes.text} />
