# A pattern

One whole screen the app has, put together from the library's components, to copy and change the words of: `src/patterns/<name>/`, with `<name>.html` and `<name>.json`. Its definition says when to use it and when to use another pattern instead, so a designer, or a tool, can choose between patterns from the definitions alone.

A pattern uses only the library's components. If the screen needs one the library hasn't, build that component first (see [component.md](component.md)), in the same branch, then the pattern.

## Checklist

- [ ] Taken from a real screen of the app: name it in `screen` ("Sign out, the confirmation opened from Settings") and its view in `sources`, pinned to the commit you read. Read the screen's source for its order, headings and buttons, and look at its snapshot (see [sources.md](sources.md)).
- [ ] `<name>.html` is one `<govuk-app-screen>` and what's in it, nothing else: no `<govuk-app>`, no frame, no scripts. Its content is generic but real, such as "Delete saved details", not lorem ipsum or the app's own feature names.
- [ ] `purpose`: what the screen is for, in a sentence or two.
- [ ] `when`: each a situation in a journey that it fits.
- [ ] `avoid`: when it's the wrong pattern, and what to use instead. `instead` names another pattern exactly, by its `name` ("Outcome"), so its page links there, or says what to do in words. Read the other patterns' `when` and `avoid`, and add an entry to theirs pointing here where someone might choose them by mistake.
- [ ] `components`: exactly the components the HTML uses, by element name, a part's component rather than the part (`govuk-app-grouped-list`, not `govuk-app-grouped-list-row`). The build checks.
- [ ] `notes`: what to change in its HTML, and how its buttons work: they go nowhere of their own, a page listens for clicks by `name`.
- [ ] Buttons have a `name`, so a page can tell them apart.

## Skeleton

`src/patterns/<name>/<name>.html`, after `confirmation`:

```html
<govuk-app-screen background="modal">
  <govuk-app-nav-bar>
    <govuk-app-nav-bar-item icon="close" name="cancel">Close</govuk-app-nav-bar-item>
  </govuk-app-nav-bar>
  <govuk-app-heading level="1" size="title-1"><The screen's question or title></govuk-app-heading>
  <govuk-app-text><What it means, in a sentence or two.></govuk-app-text>
  <govuk-app-button-stack slot="footer">
    <govuk-app-button name="continue"><What the main action does></govuk-app-button>
  </govuk-app-button-stack>
</govuk-app-screen>
```

`src/patterns/<name>/<name>.json`:

```json
{
  "$schema": "../../schemas/pattern.schema.json",
  "name": "<What a designer calls it>",
  "purpose": "<What the screen is for.>",
  "when": ["<A situation in a journey it fits.>"],
  "avoid": [
    { "when": "<When it's wrong.>", "instead": "<Another pattern's name>" }
  ],
  "components": ["govuk-app-screen", "govuk-app-nav-bar", "govuk-app-heading", "govuk-app-text", "govuk-app-button-stack", "govuk-app-button"],
  "screen": "<Which screen of the app, in words>",
  "sources": {
    "figma": [],
    "ios": [{ "repo": "govuk-once/govuk-mobile-ios-app", "path": "<path>", "symbol": "<View>", "ref": "<commit>" }],
    "android": [{ "repo": "govuk-once/govuk-mobile-android-app", "path": "<path>", "symbol": "<Screen>", "ref": "<commit>" }]
  },
  "notes": ["<What to change, and how its buttons work.>"]
}
```

## Checking it

- `npm run build` checks the schema and that `components` matches the HTML.
- `npm run screenshots -- --url /patterns/<name>/` draws its page; the screenshots are in `screenshots-out/pages/patterns-<name>/`. Compare with the app's screenshot of the screen.
- The `library-review` checklist has a Patterns section.
