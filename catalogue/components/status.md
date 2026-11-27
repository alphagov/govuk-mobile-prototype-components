# Status `<govuk-app-status>`

GOV.UK app component. **Not in the app yet**: proposed, from a screenshot of the future driving designs in Figma, until there’s a link to the file.

Load: `<script type="module" src="src/components/status/status.js"></script>`

Shows the state of something with a deadline or a validity, such as a vehicle's tax or MOT, or a driving licence: an icon for its state, then what it is and how it stands, such as Valid, 23 days, or Expired.

Attributes:
- `state` (valid | due | expired | none, default valid): valid: a green dot. due: a purple ring, filled as far as progress, for something coming up. expired: a circled exclamation mark. none: no icon, for something that doesn't apply, such as an MOT that isn't required.
- `progress` (string, default 1): For a due status, how full its ring is, from 0 to 1, such as 0.75. Make it the share of the time left, so it empties as the deadline nears.
- `label` (string, required): What it is, in Body Semibold, such as Tax, MOT due or Tax expiring.
- `detail` (string): Anything to say after the label on the same line, not in bold, such as a date: 12 May 2026.
- `caption` (string): The line below, in Subheadline, grey, such as Valid, 23 days, Expired or Not required.

Rules:
- Say the state in words as well, in the caption or the label: the icon alone doesn't tell everyone, such as people who can't see it or can't tell its colours apart.
- Use due for something with a deadline coming up, and count down to it in the caption, such as 23 days. Give it a progress to match.
- Use none, not valid, for something that doesn't apply, and say so: Not required.
- Keep the label to a word or two, and the caption to one short line, so two fit side by side.

Avoid:
- For a number that matters on its own, such as penalty points. Instead: `govuk-app-count` (see ../components/count.md)
- For a fact with no state, such as a vehicle's fuel. Instead: `govuk-app-labelled-icon` (see ../components/labelled-icon.md)
- For a state that needs attention, at the top of its card. Instead: `govuk-app-card-header` (see ../components/card-header.md)

Example, Valid:
```html
<govuk-app-status label="Tax" caption="Valid"></govuk-app-status>
```

Example, Expired:
```html
<govuk-app-status state="expired" label="MOT" caption="Expired"></govuk-app-status>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/status/
