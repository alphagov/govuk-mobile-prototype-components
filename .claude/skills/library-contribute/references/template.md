# A template

Real screens of the app, one or a few that link to each other, as whole pages a designer copies to start a prototype: `src/templates/<name>/`, its pages and `<name>.json`. iOS only for now. `settings` is the fullest to copy from; `home` and `chat` are smaller.

A template uses only the library's components. If a screen needs one the library hasn't, build it first (see [component.md](component.md)).

## Checklist

- [ ] Each screen taken from the app as it is today: read each view's source (and its strings, for the real words) and pin the commit. List each in `sources.ios`.
- [ ] Each page complete: `<!doctype html>`, a `<title>` ("<Screen> – GOV.UK app prototype"), the scripts it needs from `../../frame/frame.js` and `../../components/<name>/<name>.js`, and `<govuk-prototype-frame>` around one `<govuk-app>`. Nothing from `examples/`.
- [ ] A comment at the top of each page: which screen it is, then "Change:" what a designer should change, and "Leave:" what to keep so it stays like the app.
- [ ] Links between its own pages work. A link to a screen no template has is a named button (`name="your-accounts"`), not an `href` to a page that isn't there. The tab bar's tabs link to the other templates' first pages, such as `../home/index.html`.
- [ ] Works anywhere: nothing from another site except links a user would follow (`href`s to GOV.UK pages are fine). Prefer behaviour in a script file beside the page to an inline `<script>`, so a page copied into a strict Content Security Policy still works. (Some existing templates have inline scripts; don't add more.)
- [ ] `screens`: every page, in the order a journey meets them, the first where it starts, each with `file`, `title` and `description` (what it is, and how the journey gets there).
- [ ] `components`: exactly the components its pages use. The build checks this, and that each page loads the script of each component it uses.
- [ ] `when`: each a kind of prototype someone might start from it. `notes`: what to know when changing it, such as which rows go nowhere.
- [ ] Leave `examples/` as it is: templates are their own thing.

## Skeleton

`src/templates/<name>/index.html`:

```html
<!doctype html>
<!--
  Template: <Screen>, as the GOV.UK app has it.
  Where the <Name> template starts: copy the folder, then change it.

  Change: <what a designer should change>.

  Leave: <what keeps it like the app>.
-->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title><Screen> – GOV.UK app prototype</title>
  <script type="module" src="../../frame/frame.js"></script>
  <script type="module" src="../../components/screen/screen.js"></script>
  <script type="module" src="../../components/nav-bar/nav-bar.js"></script>
</head>
<body>
  <govuk-prototype-frame>
    <govuk-app highlight-actions>
      <govuk-app-screen>
        <govuk-app-nav-bar title="<Screen>" large-title></govuk-app-nav-bar>
        <!-- the screen's content -->
      </govuk-app-screen>
    </govuk-app>
  </govuk-prototype-frame>
</body>
</html>
```

`src/templates/<name>/<name>.json`:

```json
{
  "$schema": "../../schemas/template.schema.json",
  "name": "<The app's own name for the screen>",
  "purpose": "<What it is, and the screens it has.>",
  "when": ["<A kind of prototype to start from it.>"],
  "screen": "<Which screens of the app, in words>",
  "screens": [
    { "file": "index.html", "title": "<Screen>", "description": "<What it is, and what it opens.>" }
  ],
  "components": ["govuk-app-screen", "govuk-app-nav-bar"],
  "sources": {
    "ios": [{ "repo": "govuk-once/govuk-mobile-ios-app", "path": "<path>", "symbol": "<View>", "ref": "<commit>" }]
  },
  "notes": ["Copy the whole folder, so the screens keep linking to each other."]
}
```

## Checking it

- `npm run build` checks the schema, `screens`, `components`, and that each page loads its components' scripts.
- `npm run screenshots -- --url /templates/<name>/index.html` draws a page on a phone, in light and dark; do each page. They're in `screenshots-out/pages/`. Compare with the app's snapshots of the same screens.
- Its docs page is at `/templates/<name>/about/`.
