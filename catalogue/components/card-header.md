# Card header `<govuk-app-card-header>`

GOV.UK app component. **Not in the app yet**: proposed, from a screenshot of the future driving designs in Figma, until there’s a link to the file.

Load: `<script type="module" src="src/components/card-header/card-header.js"></script>`

Shows at a glance how something on a card stands, when it needs attention: the top of the card in a colour for its state, holding its title, such as Disqualified, Revoked or Expired.

Attributes:
- `tone` (caution | warning | danger, default caution): caution: pale yellow, as for an expired licence. warning: yellow, as for a revoked one. danger: red, as for a disqualified driver.
- `tall` (boolean, default false): Makes it at least 120pt tall, its content at the bottom, as the designs show a state that is the card's whole point, such as Disqualified.

Content: What it holds, such as a heading, or a line of text over one, 8pt apart.

Rules:
- Use it only for a state that needs the user's attention, such as an expired, revoked or disqualified licence. A card that's fine has no header.
- Put the state in words in its title: the colour alone doesn't tell everyone.
- Match the tone to how serious the state is: caution for something to put right, warning for something that stops the user, danger for the most serious.
- Put it in a grouped list's first row, flush, so it fills the top of the card, and say what the state means, and what to do, in the rows below.

Avoid:
- For a card that's fine, with nothing to put right. Instead: Leave the header off, and say how it stands in the card's rows
- For how a vehicle's tax or MOT, or a licence, stands, when it needs no attention. Instead: `govuk-app-status` (see ../components/status.md)
- For a warning about the whole screen, not one card. Instead: `govuk-app-banner type="warning"` (see ../components/banner.md)
- For a card's title, when the card needs no attention. Instead: `govuk-app-heading level="2"` (see ../components/heading.md)
- For a title over part of a screen. Instead: `govuk-app-section` (see ../components/section.md)
- For a title with an action beside it, such as Edit. Instead: `govuk-app-section-heading` (see ../components/section-heading.md)

Example, Danger, tall, as a disqualified driver:
```html
<govuk-app-grouped-list>
  <govuk-app-grouped-list-row type="content" flush>
    <govuk-app-card-header tone="danger" tall>
      <govuk-app-heading level="2" size="title-1">Disqualified</govuk-app-heading>
    </govuk-app-card-header>
  </govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="content">
    <govuk-app-text>You have been disqualified from driving until 24 April 2026.</govuk-app-text>
  </govuk-app-grouped-list-row>
</govuk-app-grouped-list>
```

Example, Warning, tall, as a revoked licence:
```html
<govuk-app-grouped-list>
  <govuk-app-grouped-list-row type="content" flush>
    <govuk-app-card-header tone="warning" tall>
      <govuk-app-heading level="2" size="title-1">Revoked</govuk-app-heading>
    </govuk-app-card-header>
  </govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="link" href="https://www.gov.uk/apply-first-provisional-driving-licence">Get a provisional licence</govuk-app-grouped-list-row>
</govuk-app-grouped-list>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/card-header/
