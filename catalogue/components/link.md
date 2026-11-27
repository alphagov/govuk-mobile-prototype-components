# Link `<govuk-app-link>`

GOV.UK app component. In the app.

Load: `<script type="module" src="src/components/link/link.js"></script>`

Makes a few words of a line a link, such as a GOV.UK page named in one of GOV.UK Chat's answers.

Attributes:
- `href` (string, required): Where it goes, such as a GOV.UK page.

Content: The words that are the link. Put it inside a <govuk-app-text> or a <govuk-app-bulleted-list-item>, around the words, and it takes that text's size.

Rules:
- Make the link's words say where it goes, such as the page's title, not click here.
- Use it inside a line of text. For a link on a row of its own, use a grouped list's link row, or a link card for one that should stand out.

Avoid:
- For a link on a row of its own. Instead: `govuk-app-grouped-list-row type="link"` (see ../components/grouped-list.md)
- For one destination that should stand out, such as the user's council. Instead: `govuk-app-link-card` (see ../components/link-card.md)
- For an action, such as continuing a journey. Instead: `govuk-app-button` (see ../components/button.md)

Example, In a sentence:
```html
<govuk-app-text>You can <govuk-app-link href="https://www.gov.uk/apply-renew-passport">apply for or renew your passport online</govuk-app-link>.</govuk-app-text>
```

Example, In a list:
```html
<govuk-app-bulleted-list spacing="compact">
  <govuk-app-bulleted-list-item>you need a <govuk-app-link href="https://www.gov.uk/photos-for-passports">digital photo</govuk-app-link></govuk-app-bulleted-list-item>
  <govuk-app-bulleted-list-item><govuk-app-link href="https://www.gov.uk/apply-renew-passport">start your online application</govuk-app-link></govuk-app-bulleted-list-item>
</govuk-app-bulleted-list>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/link/
