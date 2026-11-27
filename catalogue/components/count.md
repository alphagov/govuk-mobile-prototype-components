# Count `<govuk-app-count>`

GOV.UK app component. **Not in the app yet**: proposed, from a screenshot of the future driving designs in Figma, until there’s a link to the file.

Load: `<script type="module" src="src/components/count/count.js"></script>`

Shows how many of something there are, big enough to take in at a glance, such as a driver's offences and penalty points.

Attributes:
- `value` (string, required): How many, such as 0 or 12.

Content: What it counts, a word or two, such as Offences or Points.

Rules:
- Use it for a number that matters on its own, at a glance, such as penalty points. For a number in a list, use a grouped list's count row.
- Say what it counts in a word or two, and make it agree with the number: 0 Offences, 1 Offence, 12 Points.
- Put two or three side by side in summary columns, with a way to see more, such as History, in a row below them.

Avoid:
- For a number in a list, such as of unread messages. Instead: `govuk-app-grouped-list-row type="count"` (see ../components/grouped-list.md)
- For how something with a deadline stands, such as days left on a vehicle's tax. Instead: `govuk-app-status` (see ../components/status.md)
- For a number in a sentence. Instead: `govuk-app-text` (see ../components/text.md)
- To put two or three counts side by side. Instead: `govuk-app-summary-columns` (see ../components/summary-columns.md)

Example, A count:
```html
<govuk-app-count value="12">Points</govuk-app-count>
```

Example, A driver's offences and points, in summary columns:
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

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/count/
