# GOV.UK Mobile Prototype Components

Components for the GOV.UK app prototyping system: web components that look and behave like the GOV.UK app's own, so a prototype app journey can be built by writing HTML.

- [PLAN.md](PLAN.md): what the library is for and how we build it.
- [COMPONENTS.md](COMPONENTS.md): every component in the iOS and Android apps today, with screenshots. The backlog.

Documentation: <https://alphagov.github.io/govuk-mobile-prototype-components/>, with every component drawn live in light and dark beside the app's own screenshots.

## Running the docs locally

You need Node.js 22.16 or later (`nvm use` picks it up from `.nvmrc`).

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

Only the docs have a build step. The components don't: the site copies `components/` and `foundation/` as they are.

## Using a component

Load the component's script, and write its element inside a `<govuk-app>`:

```html
<script type="module" src="components/button/button.js"></script>

<govuk-app>
  <govuk-app-button name="continue">Continue</govuk-app-button>
</govuk-app>
```

See [Get started](docs/get-started/index.md) for more.

## A component

Each component is one folder, `components/<name>/`, holding its template (`.html`), styles (`.css`), element (`.js`), definition (`.json`), an optional `.md` of prose for its page, and the app's screenshots in `reference/`. Every folder with a definition gets a page on the site, with no list to update.

See [Build a component](docs/get-started/building-a-component.md) for how they work and how to add one.
