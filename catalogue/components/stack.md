# Stack `<govuk-app-stack>`

Native component. In the app.

Load: `<script type="module" src="src/components/stack/stack.js"></script>`

Lays out a few components in a row or a column, lined up and spaced as a screen needs, where no other component already does: such as a vehicle's number plate and menu button side by side on the right of its card, as the future driving designs show them.

Attributes:
- `direction` (vertical | horizontal, default vertical): vertical, a column, as a VStack; horizontal, a row, as an HStack.
- `align` (start | center | end, default center): How its items line up across it: in a row, top, middle or bottom; in a column, left, centre or right.
- `distribute` (start | end | between, default start): Where its items go along it: at its start, at its end, or the first at the start and the last at the end, as with a Spacer between them.
- `gap` (none | extra-small | small | medium | large, default small): The space between its items, from the spacing scale: 0, 4, 8, 16 or 24pt.

Content: The components it lays out, in order.

Rules:
- Use it only where no other component already lays things out: a screen, a section, a grouped list's content row and summary columns all space what they hold.
- Keep a row to a few short items, so they fit side by side on a phone.
- Leave gap at small, SwiftUI's own spacing, unless the design asks for another.

Avoid:
- To space a screen's parts apart. Instead: `govuk-app-section` (see ../components/section.md)
- For a few short facts side by side, with dividers between them. Instead: `govuk-app-summary-columns` (see ../components/summary-columns.md)
- For a screen's main action, and any way out of it, at the bottom of the screen. Instead: `govuk-app-button-stack` (see ../components/button-stack.md)
- For rows on a card. Instead: `govuk-app-grouped-list` (see ../components/grouped-list.md)

Example, A heading and a number plate, at either end:
```html
<govuk-app-stack direction="horizontal" distribute="between">
  <govuk-app-heading level="2" size="title-2">Lamborghini</govuk-app-heading>
  <govuk-app-number-plate>LH09 PZ2</govuk-app-number-plate>
</govuk-app-stack>
```

Example, Two buttons side by side:
```html
<govuk-app-stack direction="horizontal" gap="medium">
  <govuk-app-button variant="secondary" name="no">No</govuk-app-button>
  <govuk-app-button name="yes">Yes</govuk-app-button>
</govuk-app-stack>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/stack/
