## About this repo

This is a repo containing a basic SvelteKit installation with basic features to pull data from a headless Wordpress (roots/bedrock) installation. 

If you are looking for how to develop a SvelteKit app using Gutenberg blocks as your editor metaphor, look no further! As far as I know this is the only Opensource project on Github that provides everything you need to get started.

The repo for the stock Wordpress with required plugins is [here](https://github.com/notheretobeliked/bedrock-sage-headless).

## Features

- Block rendering component to render Gutenberg blocks.
- Basic core block components
- Tailwind set up with mappings to core Gutenberg block style attributes
- Dynamic routing for pages (via an [..all] route)
- OpenGraph and meta tag components pulling data from Yoast SEO for an SEO-aware default output

## Requirements

- Anything required by SvelteKit (see below)
- A working Wordpress installation with the following plugins active and functioning: 
  - WP GraphQL
  - wpengine/wp-graphql-content-blocks
- Recommended: [Bedrock-sage-headless](https://github.com/notheretobeliked/bedrock-sage-headless)
- A Primary navigation menu set up and activated in the Wordpress admin


## Installation

1. clone this repo
2. copy .env.example to .env and input correct values (see your local Wordpress installation for details)
3. 
```
pnpm i
```
4. 
```
pnpm dev
```

## Deployment

We recommend Vercel for instant prototyping, it's free – you just need to set up the .env with correct values and deploy! NB your Wordpress installation must be public and reachable from the Internet for this to work.

For other options, see the [SvelteKit docs](https://kit.svelte.dev/docs/adapters)

I would love to collaborate in turning this into a more fleshed out and fully formed system for the world to use. <a href="mailto:erik@nhtbl.studio">Reach out</a> if you're interested!

[![Build Status](https://img.shields.io/static/v1.svg?label=CSL&message=software%20against%20climate%20change&color=green?style=flat&logo=github)](https://img.shields.io/static/v1.svg?label=CSL&message=software%20against%20climate%20change&color=green?style=flat&logo=github)

## Todo

Lots. But first, log issues!

## About SvelteKit (from the SvelteKit READMe)

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm create svelte@latest

# create a new project in my-app
npm create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
