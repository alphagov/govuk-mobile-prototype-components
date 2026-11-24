# GOV.UK Mobile Prototype Components

Components for the GOV.UK app prototyping system: web components that look and behave like the GOV.UK app's own, so a prototype app journey can be built by writing HTML.

- [PLAN.md](PLAN.md): what the library is for and how we build it.
- [COMPONENTS.md](COMPONENTS.md): every component in the iOS and Android apps today, with screenshots. The backlog.
- [frame/](frame/): `<govuk-prototype-frame>`, the iPhone around a prototype: its status bar and home indicator, fitted to the window. Not part of the app, so not a component.
- [examples/](examples/): screens of the app built from the components alone, such as Home and Settings, to see them working together. Not prototypes to build on.

Documentation: <https://alphagov.github.io/govuk-mobile-prototype-components/>, with every component drawn live in light and dark beside the app's own screenshots.

## Running the docs locally

You need Node.js 26, the version in `.nvmrc` (`nvm use` picks it up). Anything from 22.16 works.

```sh
npm install
npm start
```

Then open <http://localhost:8080>. The site reloads when you change a component, its definition, or a page.

`npm run build` builds the site into `_site/`. It fails if any component's definition doesn't match [`component.schema.json`](component.schema.json).

The site is built with the [GOV.UK Eleventy Plugin](https://github.com/x-govuk/govuk-eleventy-plugin), and published to GitHub Pages from `main` by [`.github/workflows/docs.yml`](.github/workflows/docs.yml). Its source is in `docs/`:

| Path | What it holds |
| --- | --- |
| `docs/*.md`, `docs/get-started/` | Pages of prose. Add a Markdown file to add a page |
| `docs/_data/components.js` | Reads and checks every `components/<name>/<name>.json` |
| `docs/components/component.njk` | Draws a page for each component from its definition |
| `docs/eleventy.config.js` | The site's configuration |

Only the docs have a build step. The components don't: the site copies `components/`, `foundation/` and `frame/` as they are.

## Checking what a component looks like

`npm run screenshots` draws every component's examples, and every page in `examples/`, in light and dark, in a headless Chromium, so you can see them without a browser. It builds the site first, and serves it itself.

The first time, install the browser it draws with:

```sh
npx playwright install chromium
```

Then:

```sh
npm run screenshots                          # everything
npm run screenshots -- button                # one component's examples
npm run screenshots -- --examples            # only the pages in examples/
npm run screenshots -- --url /examples/settings/index.html   # any page of the site
npm run screenshots -- button --no-build     # use the site already in _site/
```

They go in `screenshots-out/`, which git ignores: `<component>/<example>-light.png` and `-dark.png`, `examples/…`, and `pages/…` for `--url`. Open `screenshots-out/index.html` to see each component's screenshots beside the app's own, from its `reference/` folder.

## Using a component

Load the component's script, and write its element inside a `<govuk-app>`:

```html
<script type="module" src="components/button/button.js"></script>

<govuk-app>
  <govuk-app-button name="continue">Continue</govuk-app-button>
</govuk-app>
```

See [Get started](docs/get-started/index.md) for more.

## Using it in another project

Install it from GitHub, at a tag or commit, so it changes only when you choose:

```sh
npm install github:alphagov/govuk-mobile-prototype-components#<tag or commit>
```

Then serve `node_modules/govuk-mobile-prototype-components/` with your pages, and load each component's script from there. The components load their templates, styles and fonts from beside their scripts, and nothing from anywhere else, so they work under a strict Content Security Policy and offline.

The package has the components, the foundation and the frame, and none of the app's screenshots, which are only for this repository's docs.

## Licence

MIT, except the GOV.UK crown and wordmark, which are Crown copyright and only for GOV.UK services, and the fonts, which have licences of their own. See [LICENSE](LICENSE).

## A component

Each component is one folder, `components/<name>/`, holding its template (`.html`), styles (`.css`), element (`.js`), definition (`.json`), an optional `.md` of prose for its page, and the app's screenshots in `reference/`. Every folder with a definition gets a page on the site, with no list to update.

See [Build a component](docs/get-started/building-a-component.md) for how they work and how to add one.
