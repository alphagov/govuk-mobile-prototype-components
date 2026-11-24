# Labelled icon `<govuk-app-labelled-icon>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/labelled-icon/labelled-icon.js"></script>`

Shows a short fact with an icon that says what kind of fact it is, such as a vehicle's year with a calendar, its fuel with a pump, or its colour with a palette.

Attributes:
- `icon` (string, required): The name of a Material Symbol, such as calendar_month, local_gas_station or palette.
- `layout` (stacked | inline, default stacked): stacked: the icon over its label, both centred, as the app shows them side by side. inline: the icon before its label, as the app shows them when they don't fit side by side.
- `label` (string): What screen readers hear in place of the label alone, when the label doesn't say what it's about, such as Year of manufacture: 2021.

Content: The fact, a word or two, such as 2021, Petrol or Yellow.

Rules:
- Keep the label to a word or two: stacked, it stays on one line.
- Pick an icon that says what kind of fact it is, not what it is: a calendar for a year, whatever the year.
- Give it a label for screen readers when the fact alone doesn't say what it's about, as 2021 doesn't.
- Put a few side by side in summary columns, as the app does a vehicle's year, fuel and colour.

Avoid:
- For something with a deadline or a validity, such as a vehicle's tax. Instead: `govuk-app-status` (see ../components/status.md)
- For a number that matters on its own, such as penalty points. Instead: `govuk-app-count` (see ../components/count.md)
- For a fact that needs more than a word or two. Instead: `govuk-app-grouped-list-row type="information"` (see ../components/grouped-list.md)
- For a vehicle's registration. Instead: `govuk-app-number-plate size="small"` (see ../components/number-plate.md)

Example, Stacked:
```html
<govuk-app-labelled-icon icon="calendar_month" label="Year of manufacture: 2021">2021</govuk-app-labelled-icon>
```

Example, Inline:
```html
<govuk-app-labelled-icon icon="local_gas_station" layout="inline" label="Fuel: Petrol">Petrol</govuk-app-labelled-icon>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/labelled-icon/
