# Bulleted list `<govuk-app-bulleted-list>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/bulleted-list/bulleted-list.js"></script>`

Lists a few short points, each after a bullet, usually finishing a sentence that comes before it, such as what the app stores about the user or what sharing statistics shares.

Attributes:
- `spacing` (regular | compact, default regular): regular: the text 16pt after the bullet, and the points 8pt apart. compact: 8pt and 4pt, for a short list closely following its sentence, as on Your app data.

Content: Two or more <govuk-app-bulleted-list-item> elements, in order, each holding one point as text, which may include a link.

Part `<govuk-app-bulleted-list-item>`: One point in the list, as text, which may include a link or a few words in bold.

Rules:
- Introduce the list with a sentence ending in a colon, and write each point to finish it: in lower case, with no full stop, as the app does.
- Keep each point short, a line or two.
- Use it for points that are read together, not for steps in order or for things to tap: use a grouped list for those.
- Use one spacing throughout a journey's screens.

Avoid:
- For things the user can tap, such as other screens. Instead: `govuk-app-grouped-list-row type="navigation"` (see ../components/grouped-list.md)
- For two to four short facts, to take in at a glance. Instead: `govuk-app-summary-columns` (see ../components/summary-columns.md)
- For a single point. Instead: `govuk-app-text` (see ../components/text.md)
- For steps the user takes in order. Instead: `govuk-app-grouped-list` (see ../components/grouped-list.md)

Example, Regular, as on the screen asking to share statistics:
```html
<govuk-app-text>You can help us improve this app by agreeing to share statistics about:</govuk-app-text>
<govuk-app-bulleted-list>
  <govuk-app-bulleted-list-item>the pages you visit within the app</govuk-app-bulleted-list-item>
  <govuk-app-bulleted-list-item>how long you spend on each page</govuk-app-bulleted-list-item>
  <govuk-app-bulleted-list-item>what you tap on while you're on each page</govuk-app-bulleted-list-item>
  <govuk-app-bulleted-list-item>errors that happen</govuk-app-bulleted-list-item>
</govuk-app-bulleted-list>
```

Example, Compact, as on Your app data:
```html
<govuk-app-text>We store a small amount of data about you to improve your experience in the app, like:</govuk-app-text>
<govuk-app-bulleted-list spacing="compact">
  <govuk-app-bulleted-list-item>your notification settings</govuk-app-bulleted-list-item>
  <govuk-app-bulleted-list-item>a unique ID for this app (Push ID)</govuk-app-bulleted-list-item>
</govuk-app-bulleted-list>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/bulleted-list/
