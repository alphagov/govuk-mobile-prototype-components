# Section heading `<govuk-app-section-heading>`

GOV.UK app component. In the app.

Load: `<script type="module" src="src/components/section-heading/section-heading.js"></script>`

Heads a section of a screen, such as a widget on the home screen, with an action for the whole section beside it if it has one, such as Edit or See all.

Attributes:
- `level` (1 | 2 | 3 | 4 | 5 | 6, default 2): Its place in the screen's outline. Drawn as h1 to h6, always in Title 3.
- `action` (string): The action's text, such as Edit or See all. Without it, there is no action.
- `href` (string): Makes the action a link to this page.
- `name` (string): The action's button's name, to tell which was pressed.
- `value` (string): The action's button's value.

Content: The section's title.

Rules:
- Use it over a section the user can act on as a whole, such as a home screen widget. For any other heading, use the heading.
- Give the action a short verb or phrase for what it does to the section: Edit, or See all. Never more than one action.
- Keep the title short, so it and the action fit on one line.

Avoid:
- For a heading with no action. Instead: `govuk-app-heading` (see ../components/heading.md)
- For a screen's title, when it has a navigation bar. Instead: `govuk-app-nav-bar title="Settings"` (see ../components/nav-bar.md)
- For a screen's title, when it has no navigation bar. Instead: `govuk-app-heading level="1"` (see ../components/heading.md)
- For a part of a long screen, with a line saying what it's for. Instead: `govuk-app-section` (see ../components/section.md)
- For several actions on a section. Instead: `govuk-app-menu-button` (see ../components/menu-button.md)
- For how something on a card stands, when it needs the user's attention, such as an expired licence. Instead: `govuk-app-card-header` (see ../components/card-header.md)

Example, With an action:
```html
<govuk-app-section-heading action="Edit" name="edit-topics">Topics</govuk-app-section-heading>
```

Example, Without one:
```html
<govuk-app-section-heading>Your local services</govuk-app-section-heading>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/section-heading/
