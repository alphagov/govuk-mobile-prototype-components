# Text `<govuk-app-text>`

Native component. In the app.

Load: `<script type="module" src="src/components/text/text.js"></script>`

A paragraph of the app's text: Body, as most of it is, or a smaller style for details such as dates, captions and supporting information.

Attributes:
- `size` (title-1 | body | callout | subheadline | footnote | caption-1 | caption-2, default body): The text style it is drawn in. title-1 is Title 1, regular, larger than Body, as the app sets the text on its green screens.
- `emphasis` (boolean, default false): Draws it semibold, as GovKit's bodySemibold and the like.
- `colour` (primary | secondary, default primary): secondary: grey, text.secondary, for supporting text such as a date or a hint.
- `align` (start | center, default start): center, under a centred heading, as on the app's onboarding and information screens.

Content: The paragraph's text. A few words of it can be bold, in a <govuk-app-strong>.

Rules:
- Use Body for a screen's text. Use a smaller style only for supporting details, as the app does: Subheadline or Footnote for a date or a label, Caption for the smallest notes.
- Use Title 1 only for the few lines of a screen that takes over the app, such as a green one, as the app does.
- Use one text element for each paragraph. A screen spaces them 16pt apart.
- Use emphasis sparingly, for a word or line that has to stand out. For a heading, use the heading.
- Use the secondary colour only for supporting text, never for something the user must read to act.
- Centre text only under a centred heading.

Avoid:
- For a screen's title, or a section's. Instead: `govuk-app-heading` (see ../components/heading.md)
- For a few words that say what the rest of a line is. Instead: `govuk-app-strong` (see ../components/strong.md)
- For a few points that are read together. Instead: `govuk-app-bulleted-list` (see ../components/bulleted-list.md)
- For a name and postal address. Instead: `govuk-app-address` (see ../components/address.md)
- For something the user should know now, set apart from the screen. Instead: `govuk-app-banner` (see ../components/banner.md)
- For GOV.UK Chat's answer to a question. Instead: `govuk-app-chat-answer` (see ../components/chat-answer.md)

Example, A paragraph:
```html
<govuk-app-text>If you’re using Face ID or Touch ID to unlock the app, this will be turned off. You can turn it on again the next time you sign in.</govuk-app-text>
```

Example, Emphasised, and secondary:
```html
<govuk-app-text emphasis>Your MOT expires on 14 March 2027</govuk-app-text>
<govuk-app-text size="subheadline" colour="secondary">Last checked today at 9:41am</govuk-app-text>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/text/
