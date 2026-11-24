# Summary columns `<govuk-app-summary-columns>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/summary-columns/summary-columns.js"></script>`

Lays out a few short facts side by side, in equal columns with a divider between them, so they can be taken in at a glance: a vehicle's year, fuel and colour, a driver's offences and points, or a vehicle's tax and MOT.

Content: Two to four <govuk-app-summary-column> elements, left to right, each holding one component, such as a <govuk-app-labelled-icon>, a <govuk-app-count> or a <govuk-app-status>.

Part `<govuk-app-summary-column>`: One column, holding one component, such as a labelled icon, a count or a status.

Rules:
- Use it for two to four facts of the same kind, worth taking in at a glance. For more, or for longer ones, use a grouped list.
- Put the same kind of component in every column: all labelled icons, all counts, or all statuses.
- Keep what's in each column short, so it fits in a narrow column.
- Put it inside a card, such as a grouped list's content row with flush, with anything more about the facts, such as History, in a row below it.

Avoid:
- For more than four facts, or longer ones. Instead: `govuk-app-grouped-list` (see ../components/grouped-list.md)
- For facts of different kinds. Instead: `govuk-app-grouped-list-row type="information"` (see ../components/grouped-list.md)
- To put a few components side by side that aren't facts, such as a number plate and a menu button. Instead: `govuk-app-stack direction="horizontal"` (see ../components/stack.md)

Example, Labelled icons, as a vehicle's year, fuel and colour:
```html
<govuk-app-summary-columns>
  <govuk-app-summary-column>
    <govuk-app-labelled-icon icon="calendar_month" label="Year of manufacture: 2021">2021</govuk-app-labelled-icon>
  </govuk-app-summary-column>
  <govuk-app-summary-column>
    <govuk-app-labelled-icon icon="local_gas_station" label="Fuel: Petrol">Petrol</govuk-app-labelled-icon>
  </govuk-app-summary-column>
  <govuk-app-summary-column>
    <govuk-app-labelled-icon icon="palette" label="Colour: Yellow">Yellow</govuk-app-labelled-icon>
  </govuk-app-summary-column>
</govuk-app-summary-columns>
```

Example, Counts (proposed), as a driver's offences and points:
```html
<govuk-app-summary-columns>
  <govuk-app-summary-column>
    <govuk-app-count value="2">Offences</govuk-app-count>
  </govuk-app-summary-column>
  <govuk-app-summary-column>
    <govuk-app-count value="12">Points</govuk-app-count>
  </govuk-app-summary-column>
</govuk-app-summary-columns>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/summary-columns/
