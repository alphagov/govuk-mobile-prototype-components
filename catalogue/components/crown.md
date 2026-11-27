# Crown `<govuk-app-crown>`

GOV.UK app component. In the app.

Load: `<script type="module" src="src/components/crown/crown.js"></script>`

Ends the home screen: the crown, which grows and fades in as the user scrolls to the end, so they can tell there is nothing more below it.

Content: None.

Rules:
- Use it only on the home screen, as the app does.
- Put it last in the <govuk-app-screen>, after the last widget and before the tab bar. It grows over the last 70pt of the screen's scroll, so anything after it would leave it part grown.
- It is decorative, so assistive technology skips it. Don't give it a label.

Avoid:
- On any screen but Home. Instead: Leave it out: other screens end with their last section
- For the GOV.UK wordmark at the top of Home. Instead: `govuk-app-home-header` (see ../components/home-header.md)

Example, At the end of the home screen:
```html
<govuk-app-screen>
  <govuk-app-text align="center">Tell us what you think about the app</govuk-app-text>
  <govuk-app-button variant="grouped-secondary">Give feedback</govuk-app-button>
  <govuk-app-crown></govuk-app-crown>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/crown/
