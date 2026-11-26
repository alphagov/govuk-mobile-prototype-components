---
layout: sub-navigation
title: Work on the library
description: Run this site, check your changes, and release the library.
sectionKey: Get started
order: 3
---

The rules we’ve agreed are in [AGENTS.md](https://github.com/alphagov/govuk-mobile-prototype-components/blob/main/AGENTS.md), for people and for Claude Code alike. [Build a component](/get-started/building-a-component/) says how one is put together.

## Run this site

You need Node.js 26, the version in `.nvmrc` (`nvm use` picks it up). Anything from 22.16 works.

```sh
npm install
npm start
```

Then open <http://localhost:8080>. The site reloads when you change a component, its definition or a page.

## What’s where

`src/` is the library, and everything a release holds:

| Path | What it holds |
| --- | --- |
| `src/components/` | One folder per component |
| `src/patterns/` | Whole screens, arranged as the app arranges them |
| `src/templates/` | Real screens of the app, such as Settings, Home and Chat, to start a prototype from |
| `src/foundation/` | What every component relies on: the app’s tokens, the `<govuk-app>` root and `component.js` |
| `src/frame/` | `<govuk-prototype-frame>`, the iPhone around a prototype |
| `src/schemas/` | What a component’s, pattern’s and template’s definition must say |
| `src/starter/`, `src/bin/` | What a new prototype starts from, and the command that makes one |

Around it are `examples/`, `docs/` (this site), `scripts/`, and `inventory/`, the survey of every component in the iOS and Android apps. This site publishes `src/` at the same paths, so a link that works in the repository works here.

## Check your changes

`npm run build` builds this site into `_site/`. It fails if a component’s, pattern’s or template’s definition doesn’t match its schema, if a component isn’t in one of the catalogue index’s groups, or if a page is missing from the sidebar. It writes the catalogue, into `catalogue/`, first.

`npm run check` looks through every component for the rules a script can spot, such as raw colours, spacing off the 8pt grid, or styles on another component’s classes. It fails if it finds anything that must be fixed, and lists other things worth a look. Every pull request runs it, before the build.

`npm run screenshots` draws every component’s examples, and every page in `examples/`, in light and dark, in a headless browser, so you can see them without opening one. The first time, install the browser it uses:

```sh
npx playwright install chromium
```

Then:

```sh
npm run screenshots                          # everything
npm run screenshots -- button                # one component’s examples
npm run screenshots -- --examples            # only the pages in examples/
npm run screenshots -- --url /examples/settings/index.html   # any page of the site
npm run screenshots -- button --no-build     # use the site already in _site/
```

They go in `screenshots-out/`, which git ignores. Open `screenshots-out/index.html` to see each component’s screenshots beside the app’s own.

With Claude Code, two skills in this repository do this for you:

- **library-contribute** adds or changes a component, pattern or template, from the app’s source, a Figma design or screenshots, and opens a pull request.
- **library-review** checks a change, yours or a pull request, against the rules in AGENTS.md, and reports what to fix in plain words.

## How this site is made

It’s built with the [GOV.UK Eleventy Plugin](https://github.com/x-govuk/govuk-eleventy-plugin), and published to GitHub Pages from `main`. Its source is in `docs/`:

| Path | What it holds |
| --- | --- |
| `docs/*.md`, `docs/get-started/` | Pages of prose. Add a Markdown file to add a page |
| `docs/_data/` | Reads and checks every component’s, pattern’s and template’s definition |
| `docs/components/`, `docs/patterns/`, `docs/templates/` | Draw a page for each from its definition |
| `docs/eleventy.config.js` | The site’s configuration |

Only this site has a build step. The components don’t: the site copies them as they are.

## Release the library

A release is a tag, `vX.Y.Z`, made by the Release workflow. To make one:

1. In GitHub, go to **Actions**, then **Release**, then **Run workflow**.
2. Enter the version, such as `0.6.0`, without the `v`. It must be greater than the latest release.
3. Run it.

It builds the site, so a definition the build refuses stops the release. Then it makes a commit on top of `main` holding the new version and the generated catalogue, tags it, and pushes only the tag, so `main` never holds generated files. Last, it makes a GitHub release with notes listing the pull requests merged since the last one, and attaches the package as `govuk-mobile-prototype-components.tgz`. The name is the same for every release, so making a prototype always downloads the latest from `releases/latest/download/`.

`main`’s `package.json` says `0.0.0`, because `main` isn’t a release: the tags are the list of versions. Tags before v0.4.0 were made by hand, and have no catalogue.
