# Link card `<govuk-app-link-card>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/link-card/link-card.js"></script>`

Makes one destination stand out, on a card of its own that's a link, with its name large and bold, such as the user's council on Home. A description above the name can say what it's for.

Attributes:
- `href` (string, required): Where the card goes, such as the council's website.
- `description` (string): Shown above the name, in grey, saying what it's for, such as County councils are usually responsible for services like education, social care and transport.

Content: The name of where it goes, as text, such as Central Bedfordshire Council.

Rules:
- Use it for one destination worth making stand out, such as the user's own council. For a list of links, use a grouped list.
- Put it under a section heading saying what it is, such as Your local services.
- Keep the name to what the user will recognise, such as the council's own name.
- Give each card a description when there are two or more, saying how they differ, as the app does for a county council and a district council.

Avoid:
- For a list of links. Instead: `govuk-app-grouped-list-row type="link"` (see ../components/grouped-list.md)
- For a link within a line of text. Instead: `govuk-app-link` (see ../components/link.md)
- For a screen in the app, among others. Instead: `govuk-app-grouped-list-row type="navigation"` (see ../components/grouped-list.md)

Example, A council:
```html
<govuk-app-link-card href="https://www.centralbedfordshire.gov.uk">Central Bedfordshire Council</govuk-app-link-card>
```

Example, With a description:
```html
<govuk-app-link-card href="https://www.derbyshire.gov.uk" description="County councils are usually responsible for services like education, social care and transport">Derbyshire County Council</govuk-app-link-card>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/link-card/
