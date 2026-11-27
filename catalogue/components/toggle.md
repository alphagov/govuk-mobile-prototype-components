# Toggle `<govuk-app-toggle>`

Native component. In the app.

Load: `<script type="module" src="src/components/toggle/toggle.js"></script>`

Switches something on or off straight away, such as sharing app usage statistics.

Attributes:
- `checked` (boolean, default false): Whether it is on.
- `label` (string): Its name for screen readers, such as Share app usage statistics. Leave it off inside a <label> that names it already.
- `name` (string): Its name, to tell it apart in its change event or in a form.
- `value` (string): Its value, sent with a form when it is on.

Rules:
- Use a toggle for something that takes effect as soon as it is switched, not for a choice confirmed with a button.
- For a setting in a list, use a grouped list's toggle row, as the app does on Settings. Use a toggle on its own only where there's no list for it.
- Always give it a name: a label, or a <label> around it and the text beside it.
- Name it for what it turns on, such as Share app usage statistics, not On or Off.

Avoid:
- For a setting in a list, as on Settings. Instead: `govuk-app-grouped-list-row type="toggle"` (see ../components/grouped-list.md)
- For a choice the user confirms with a button. Instead: `govuk-app-grouped-list-row type="selectable"` (see ../components/grouped-list.md)
- To switch between views of the same thing. Instead: `govuk-app-segmented-control` (see ../components/segmented-control.md)

Example, On:
```html
<govuk-app-toggle name="statistics" label="Share app usage statistics" checked></govuk-app-toggle>
```

Example, Off:
```html
<govuk-app-toggle name="statistics" label="Share app usage statistics"></govuk-app-toggle>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/toggle/
