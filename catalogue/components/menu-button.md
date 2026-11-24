# Menu button `<govuk-app-menu-button>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/menu-button/menu-button.js"></script>`

Offers a few more things the user can do with something on a card, such as a vehicle or a driving licence, without crowding the card: a round “…” button that opens a menu of them.

Attributes:
- `label` (string, default More options): The button's name for screen readers, as the app's moreOptionsButtonAccessibilityLabel.
- `name` (string): The button's name, to tell it apart when it's pressed.
- `variant` (card | chat, default card): card: a filled circle with its dots cut out, in link blue, as on a vehicle's or a licence's card. chat: three blue dots on a white circle, as beside GOV.UK Chat's field. The chat input draws its own.

Content: Its menu's items, <govuk-app-menu-button-item> elements, top to bottom. Each is a link, with an href, or a button, with a name and value. Its label is what's written between its tags. Give it destructive to draw it in red, for one that deletes something, such as Clear chat, and icon to draw a Material Symbol at its end, such as delete.

Part `<govuk-app-menu-button-item>`: One item in the menu, holding its label: a link, with an href, or a button, with a name and value.

Attributes:
- `href` (string): Makes it a link to this page.
- `name` (string): Without an href, makes it a button with this name, so a page listening for clicks can tell which was pressed.
- `value` (string): Set on the button, alongside name, to say which of several it was.
- `destructive` (boolean, default false): Draws it in red, for one that deletes something, such as Clear chat.
- `icon` (string): A Material Symbol drawn at its end, such as delete.

Rules:
- Use it for a few things the user can do with what's on its card, that don't need to be on show. Anything they'll want often belongs on the card itself.
- Put it at the top right of its card, as the app does.
- Keep its menu short, a handful of items at most, each saying what it does, such as Change address.
- Label it for screen readers if More options doesn't say enough.

Avoid:
- For an action the user will want often, on a card. Instead: `govuk-app-button variant="compact"` (see ../components/button.md)
- For an action on the whole screen, not one card. Instead: `govuk-app-nav-bar-item` (see ../components/nav-bar.md)
- To switch between views of the same thing. Instead: `govuk-app-segmented-control` (see ../components/segmented-control.md)

Example, A vehicle's menu:
```html
<govuk-app-menu-button name="vehicle-menu">
  <govuk-app-menu-button-item href="https://www.gov.uk/vehicle-tax">Tax this vehicle</govuk-app-menu-button-item>
  <govuk-app-menu-button-item href="https://www.gov.uk/getting-an-mot">Book an MOT</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="remove-vehicle">Remove vehicle</govuk-app-menu-button-item>
</govuk-app-menu-button>
```

Example, GOV.UK Chat's menu:
```html
<govuk-app-menu-button variant="chat" name="chat-menu">
  <govuk-app-menu-button-item name="clear-chat" destructive icon="delete">Clear chat</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="privacy">Privacy notice</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="about">About</govuk-app-menu-button-item>
  <govuk-app-menu-button-item name="feedback">Give feedback</govuk-app-menu-button-item>
</govuk-app-menu-button>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/menu-button/
