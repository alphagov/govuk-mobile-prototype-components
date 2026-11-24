# Heading `<govuk-app-heading>`

Native component. In the app.

Load: `<script type="module" src="components/heading/heading.js"></script>`

Titles a screen, or a section of one. Its level says where it sits in the screen's outline, for screen readers; its size, which of the app's text styles it is drawn in.

Attributes:
- `level` (1 | 2 | 3 | 4 | 5 | 6, default 2): Its place in the screen's outline: 1 is the screen's title, 2 a section of it, 3 a part of a section. Drawn as h1 to h6.
- `size` (large-title | title-1 | title-2 | title-3 | body): The text style it is drawn in. Without one, level 1 is Large Title, level 2 is Title 3, and anything smaller is Body, emphasised.
- `align` (start | center, default start): center, as the app's onboarding and information screens set their titles.

Content: The heading's text.

Rules:
- Give every screen one level 1 heading, unless its navigation bar has a title, which is the screen's heading instead.
- Don't skip levels: a level 3 heading goes inside a section with a level 2 one.
- Pick the level for the outline and the size for the look. A screen's question, such as What is your postcode?, is level 1 in Title 1; an outcome, such as a confirmation, is level 1 in Large Title.
- Centre a heading only on screens the app centres: onboarding, information and confirmation screens. Centre the text under it too.
- Write headings in sentence case, without a full stop. A question ends with a question mark.

Avoid:
- Over a section the user can act on as a whole, such as a widget with Edit. Instead: `govuk-app-section-heading` (see ../components/section-heading.md)
- For a part of a long screen, with its title and the space above it. Instead: `govuk-app-section` (see ../components/section.md)
- For a title over a list of rows. Instead: `govuk-app-grouped-list title="Privacy and legal"` (see ../components/grouped-list.md)
- For a screen's title, when it has a navigation bar. Instead: `govuk-app-nav-bar title="Settings"` (see ../components/nav-bar.md)
- For a line that should stand out, but doesn't head anything. Instead: `govuk-app-text emphasis` (see ../components/text.md)
- For a few words that say what the rest of a line is. Instead: `govuk-app-strong` (see ../components/strong.md)

Example, Each size:
```html
<govuk-app-heading level="1" size="large-title">Large Title</govuk-app-heading>
<govuk-app-heading level="1" size="title-1">Title 1</govuk-app-heading>
<govuk-app-heading level="2" size="title-2">Title 2</govuk-app-heading>
<govuk-app-heading level="2" size="title-3">Title 3</govuk-app-heading>
<govuk-app-heading level="3" size="body">Body</govuk-app-heading>
```

Example, Centred, on an onboarding screen:
```html
<govuk-app-heading level="1" align="center">Allow notifications?</govuk-app-heading>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/heading/
