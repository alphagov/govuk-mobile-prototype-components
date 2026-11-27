# Strong `<govuk-app-strong>`

Native component. **Not in the app yet**: proposed, from a screenshot of the future driving designs in Figma, until there’s a link to the file.

Load: `<script type="module" src="src/components/strong/strong.js"></script>`

Makes a few words of a line bold, where they say what the rest of it is, such as Expired before a date, or 1 year 28 days before remaining.

Content: The words to make bold. Put it inside a <govuk-app-text>, around the words, and it takes that text's size and colour.

Rules:
- Bold only the words that say what the rest of the line is, such as Expired before a date.
- For a whole line in bold, give the text emphasis instead. For a heading, use the heading.
- Use it once in a line at most: more, and nothing stands out.

Avoid:
- For a whole line in bold. Instead: `govuk-app-text emphasis` (see ../components/text.md)
- For a heading. Instead: `govuk-app-heading` (see ../components/heading.md)
- For words that go somewhere. Instead: `govuk-app-link` (see ../components/link.md)

Example, A status before a date:
```html
<govuk-app-text size="subheadline"><govuk-app-strong>Expired</govuk-app-strong> 28 March 2026</govuk-app-text>
```

Example, A time left:
```html
<govuk-app-text><govuk-app-strong>1 year 28 days</govuk-app-strong> remaining</govuk-app-text>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/strong/
