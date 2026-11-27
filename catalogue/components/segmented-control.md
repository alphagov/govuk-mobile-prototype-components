# Segmented control `<govuk-app-segmented-control>`

Native component. In the app.

Load: `<script type="module" src="src/components/segmented-control/segmented-control.js"></script>`

Switches between two or three views of the same thing, side by side, such as a driving account's Vehicles and Licence, or Your topics and All topics.

Attributes:
- `label` (string): Its name for screen readers, such as Driving, as the app's picker's label.

Content: Two or three <govuk-app-segmented-control-item> elements, left to right. Mark the one that's showing selected. Give each an href, to make it a link to another page, or name and value, to tell it apart as a button. Its label is what's written between its tags.

Part `<govuk-app-segmented-control-item>`: One segment, holding its label: a link to another page, or a button.

Attributes:
- `href` (string): Makes it a link to this page.
- `name` (string): Without an href, makes it a button with this name, so a page listening for clicks can tell which was pressed.
- `value` (string): Set on the button, alongside name, to say which of several it was.
- `selected` (boolean, default false): The segment that's showing.

Rules:
- Use it to switch between views of the same thing, not to go somewhere new: for that, use a navigation row or the tab bar.
- Use two or three segments, each one short word or two, so they fit side by side.
- Select exactly one segment: the one whose view is showing.
- Put it at the top of what it switches, 16pt in from the screen's edges, as the app does.

Avoid:
- To go to another screen. Instead: `govuk-app-grouped-list-row type="navigation"` (see ../components/grouped-list.md)
- To move between the app's sections, Home, Chat and Settings. Instead: `govuk-app-tab-bar` (see ../components/tab-bar.md)
- To switch a setting on or off. Instead: `govuk-app-toggle` (see ../components/toggle.md)
- For more than three views. Instead: A grouped list of navigation rows, one for each, each going to its own screen

Example, Two segments:
```html
<govuk-app-segmented-control label="Driving">
  <govuk-app-segmented-control-item name="vehicles" selected>Vehicles</govuk-app-segmented-control-item>
  <govuk-app-segmented-control-item name="licence">Licence</govuk-app-segmented-control-item>
</govuk-app-segmented-control>
```

Example, Segments that link to other pages:
```html
<govuk-app-segmented-control label="Topics">
  <govuk-app-segmented-control-item href="#your-topics" selected>Your topics</govuk-app-segmented-control-item>
  <govuk-app-segmented-control-item href="#all-topics">All topics</govuk-app-segmented-control-item>
</govuk-app-segmented-control>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/segmented-control/
