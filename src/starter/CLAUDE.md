# A GOV.UK app prototype

This folder is a prototype of the GOV.UK app, made of HTML pages that look and behave like the app on an iPhone. It's built from the GOV.UK app prototype components library, installed in `node_modules/govuk-mobile-prototype-components/`. iOS only.

Where its files are is in one place, `library.js`: `node library.js` prints them. Below, `<library>` is its `libraryFiles` on disk (components, foundation, frame, patterns, templates), `<url>` its `libraryUrl`, and `<catalogue>` its `catalogue`.

## Who you're working with

A designer, who may never have used a terminal or written code. So:

- Talk in plain, short UK English. No jargon: say "screen", not "HTML file"; "save a version", not "commit"; "the prototype isn't running", not "the server exited". If a word like "terminal" is unavoidable, say what it is.
- Do the technical work yourself. Ask before installing anything on their computer, and say why it's needed.
- After a change, give them the link to the screen to look at, such as <http://localhost:3000/screens/settings/index.html> (the port is whichever `npm start` printed). It reloads by itself.
- Never paste raw errors. Say what went wrong in a sentence, and what you're doing about it.
- If the prototype isn't running or won't load, use the `prototype-setup` skill. To add a part of the app, or a new screen, use `prototype-add-screens`.

## How it fits together

| Path | What it is |
| --- | --- |
| `screens/` | The prototype's screens, one HTML page each, in a folder for each part of the app, such as `screens/settings/`. Change these |
| `components/<name>/` | Anything custom this prototype needs that the library hasn't got |
| `prototype.json` | The prototype's name, and its screens, which the start page lists. Add each new screen here |
| `index.html` | The start page, at <http://localhost:3000/> |
| `prototype.js` | Remembers answers across screens (read its comment) |
| `scripts/add-screens.js` | Adds a template's screens, or a blank one |
| `scripts/use-latest-components.js` | Points `package.json` at the latest version of the components |
| `server.js` | Serves it all, at `/`, and the library's whole package at `/library/`. `npm start` |
| `library.js` | Where the installed library's files are. The only place that says so |

Every screen loads the library from `/library/`, never `../../` or `node_modules`. A path the catalogue gives is from the package's root, so its URL is `/library/` and that path. Otherwise it's `<url>` and the file: `<script type="module" src="<url>components/button/button.js"></script>`, `<url>frame/frame.js`. Copy the paths from a screen that's here already. Every screen also loads `<script type="module" src="/prototype.js"></script>`.

## Making screens

Read `<catalogue>/index.md` first. Then read only the cards it links to for what you might use, not the whole catalogue. Choose in this order:

1. **A template**: a whole part of the app, such as Settings, in `<library>/templates/`. Add it with `node scripts/add-screens.js <template>`, which copies its pages into `screens/<template>/`, points them at the library, adds prototype.js and lists them in prototype.json. Then change their words, following the comment at the top of each page.
2. **A pattern**: one whole screen, in `<library>/patterns/`. Put it in a page like the screens already here.
3. **Components**, put together following each one's rules on its card.
4. **Something custom**, only when nothing in the library fits. Tell the designer it isn't one of the app's own, and make it the library's way: `components/<name>/` with `<name>.html`, `.css`, `.js`, using `defineComponent` from `<url>foundation/component.js`, styled only with the `--app-*` tokens in `<library>/foundation/tokens.css` (colour, type, and spacing on the 8pt grid), its own `govuk-app-<name>` classes, and light and dark both working. Like the library, it loads nothing from other sites, so it works offline: put any fonts or images it needs in its folder. Look at a library component, such as `<library>/components/button/`, first.

Keep each page as the app has it: one `<govuk-app highlight-actions>` in a `<govuk-prototype-frame>`. Don't style anything inside `<govuk-app>` from the page. Buttons go nowhere unless the page listens for them by name: link screens with `href` where a component takes one, and add `works` to any button the page acts on.

A screen's wiring, such as where its buttons go, goes in a `<script type="module">` in its `<head>`, as the templates' pages have it: see `sign-out.html` in the Settings template.

Never change anything in `node_modules/`. If the library can't do something, build it in `components/` and say so.

## Keeping versions

If this folder has a version history (a `.git` folder: check for it, don't run git to find out, as on a Mac without Apple's developer tools that asks to install them), save a version quietly after each change that works: `git add -A && git commit -q -m "<what changed, in plain words>"`. Don't mention git, commits or branches. If they ask to undo, go back to how it was before with git; without a history, use Claude Code's own rewind (`/rewind`), or undo the change by hand. Never push anywhere: the prototype stays on this computer.

## Updating the components

The prototype keeps the version of the components it was made with. If the designer asks for the latest, run `node scripts/use-latest-components.js` then `npm install`, check every screen still loads, and save a version if there's a history.
