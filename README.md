## About this repo

This is a repo containing a basic SvelteKit installation with basic features to pull data from a headless Wordpress (roots/bedrock) installation.

If you are looking for how to develop a SvelteKit app using Gutenberg blocks as your editor metaphor, look no further! As far as I know this is the only Opensource project on Github that provides everything you need to get started.

The repo for the stock Wordpress with required plugins is [here](https://github.com/notheretobeliked/bedrock-sage-headless).

## Stack

- [SvelteKit 2](https://kit.svelte.dev/) with [Svelte 5](https://svelte.dev/) (runes mode)
- [Tailwind CSS 4](https://tailwindcss.com/) (via Vite plugin)
- [TypeScript](https://www.typescriptlang.org/) with strict mode
- [GraphQL Code Generator](https://the-guild.dev/graphql/codegen) for type-safe queries

## Features

- **Block rendering system** - A `BlockRenderer` component that maps Gutenberg block types to Svelte components, with Tailwind classes derived from block attributes (alignment, spacing, colors)
- **14 core block components** - Paragraph, Heading, Image, Video, Embed, Button/Buttons, Columns/Column, Group, List/ListItem, Spacer, Footnotes
- **Tailwind/Gutenberg integration** - Block alignment (`align-full`, `align-wide`) and background colors mapped to Tailwind utility classes
- **Dynamic catch-all routing** - A `[...all]` route that queries WordPress by URI, supporting pages and posts
- **SEO from Yoast** - OpenGraph and Twitter Card meta components pulling data from Yoast SEO via GraphQL
- **Content preview** - Token-based preview system for viewing draft/pending content from the WordPress editor
- **GraphQL codegen** - Auto-generated TypeScript types from your WordPress GraphQL schema

## Requirements

- Node.js (LTS recommended)
- [pnpm](https://pnpm.io/)
- A working WordPress installation with the following plugins active:
  - [WPGraphQL](https://www.wpgraphql.com/)
  - [wp-graphql-content-blocks](https://github.com/wpengine/wp-graphql-content-blocks)
  - [WPGraphQL for ACF](https://github.com/wp-graphql/wpgraphql-acf) (if using ACF)
  - [WPGraphQL for Yoast SEO](https://github.com/ashhitch/wp-graphql-yoast-seo) (for SEO features)
- Recommended: [bedrock-sage-headless](https://github.com/notheretobeliked/bedrock-sage-headless) as your backend
- A Primary Navigation menu set up and activated in the WordPress admin

## Installation

1. Clone the repo:
   ```
   git clone <repo-url> my-site-frontend
   cd my-site-frontend
   ```

2. Copy and configure environment:
   ```
   cp .env.example .env
   ```
   Edit `.env` with your values:
   - `GRAPHQL_ENDPOINT` - your WordPress GraphQL URL (e.g. `http://my-site.test/wp/graphql`)
   - `WORDPRESS_URL` - your WordPress base URL (e.g. `http://my-site.test`)
   - `PUBLIC_SITE_URL` - the public URL of your frontend (used for meta tags)
   - `MENU_SLUG` - your WordPress menu slug (default: `main-menu`)

3. Install dependencies:
   ```
   pnpm install
   ```

4. Generate GraphQL types (requires a running WordPress backend):
   ```
   pnpm codegen
   ```

5. Start development server:
   ```
   pnpm dev
   ```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `GRAPHQL_ENDPOINT` | Yes | WordPress GraphQL URL (e.g. `http://my-site.test/wp/graphql`) |
| `WORDPRESS_URL` | Yes | WordPress base URL |
| `PUBLIC_SITE_URL` | Yes | Public frontend URL (for OpenGraph/meta tags) |
| `MENU_SLUG` | Yes | WordPress menu slug to query |
| `CDN_URL` | No | CDN URL for asset rewriting (leave empty for WordPress URLs) |
| `WP_USERNAME` | No | WordPress username for preview authentication |
| `WP_APP_PW` | No | WordPress application password for preview authentication |

## Project structure

```
src/
  routes/
    +layout.svelte          # Root layout (Header, SEO meta)
    +layout.server.ts       # Loads menu and page-level SEO data
    [...all]/
      +page.server.ts       # Queries WordPress by URI via GraphQL
      +page.svelte          # Renders editor blocks
    preview/                # Preview mode for draft content
  components/
    BlockRenderer.svelte    # Maps block types to Svelte components
    Header.svelte           # Site header with navigation
    PreviewBanner.svelte    # "Preview Mode" indicator
    blocks/                 # Gutenberg block components
      CoreParagraph.svelte
      CoreHeading.svelte
      CoreImage.svelte
      CoreVideo.svelte
      CoreEmbed.svelte
      CoreButton.svelte
      CoreButtons.svelte
      CoreColumns.svelte
      CoreColumn.svelte
      CoreGroup.svelte
      CoreList.svelte
      CoreListItem.svelte
      CoreSpacer.svelte
      CoreFootnotes.svelte
    atoms/                  # Reusable UI primitives
    SEO/                    # OpenGraph and Twitter meta components
  lib/
    graphql/
      query/                # .graphql query files
      generated.ts          # Auto-generated types (via pnpm codegen)
    utilities/
      graphql.ts            # GraphQL fetch utility
      utilities.ts          # Shared helpers
```

## Adding custom blocks

1. Create an ACF block in WordPress (via ACF or `acf-composer`)
2. Run `pnpm codegen` to update TypeScript types
3. Create a new component in `src/components/blocks/` (e.g. `AcfMyBlock.svelte`)
4. Register it in `BlockRenderer.svelte`'s block type map

The `BlockRenderer` maps the GraphQL `__typename` (e.g. `AcfMyBlock`) to your Svelte component. Each block component receives `attributes` and `innerBlocks` as props.

## Deployment

We recommend Vercel for instant prototyping, it's free -- you just need to set up the .env with correct values and deploy! NB your Wordpress installation must be public and reachable from the Internet for this to work.

For other options, see the [SvelteKit docs on adapters](https://kit.svelte.dev/docs/adapters). The project uses `adapter-auto` which auto-detects your deployment platform.

For ISR/revalidation, set the `VERCEL_WEBHOOK` env var in your WordPress backend to trigger redeployment when content is published.

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build locally |
| `pnpm codegen` | Regenerate GraphQL TypeScript types |
| `pnpm check` | Run Svelte and TypeScript checks |
| `pnpm lint` | Run Prettier and ESLint |
| `pnpm format` | Auto-format code with Prettier |

I would love to collaborate in turning this into a more fleshed out and fully formed system for the world to use. <a href="mailto:erik@nhtbl.studio">Reach out</a> if you're interested!

## Licensed as Climate Strike Software.

Climate Strike Software is software that uses the [Climate Strike License](https://github.com/climate-strike/license), a software license that developers can use to prohibit the use of their code by applications or companies that threaten to accelerate climate change through fossil fuel extraction.

[![Build Status](https://img.shields.io/static/v1.svg?label=CSL&message=software%20against%20climate%20change&color=green?style=flat&logo=github)](https://img.shields.io/static/v1.svg?label=CSL&message=software%20against%20climate%20change&color=green?style=flat&logo=github)
