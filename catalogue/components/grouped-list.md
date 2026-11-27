# Grouped list `<govuk-app-grouped-list>`

GOV.UK app component. In the app.

Load: `<script type="module" src="src/components/grouped-list/grouped-list.js"></script>`

A section of rows on a rounded card, as on the Settings screen: rows that go to another screen, open a web page, switch something on or off, or show a value. Each section can have a title above it and a footer below.

Attributes:
- `title` (string): The section's title, above the card. Without it, the card stands alone, as on Settings.
- `level` (1 | 2 | 3 | 4 | 5 | 6, default 2): The title's place in the screen's outline. Drawn as h1 to h6, always in Title 3.
- `action` (string): Text for an action beside the title, such as See all.
- `href` (string): Makes the title's action a link to this page.
- `name` (string): The title's action's button's name.
- `value` (string): The title's action's button's value.
- `footer` (string): A note below the card, in Footnote, such as what a setting does.
- `dividers` (full): Proposed, from the future driving designs: full draws the dividers between rows right across the card, in a paler blue, for a card whose rows are parts of one thing, such as a vehicle, rather than a list. Without it, they're GovKit's, 16pt in from each side.
- `background` (subtle | accent): Draws the card in another colour, as GovKit lets the app: subtle, pale blue, for a card on a white screen; accent, a stronger blue, proposed by the future driving designs for Add vehicle. Without it, the card is white, or dark blue in dark mode.

Content: The section's rows, <govuk-app-grouped-list-row> elements, in order. Each takes a type: navigation (the default: a chevron, to another screen), link (in the link colour, with an arrow out, to a web page), information (a value on the right, in grey, that can't be pressed), detail (a value on the right in the link colour, such as Off, to change it; destructive draws its title red), toggle (a switch, drawn by <govuk-app-toggle>; checked if it is on), count (a number on the right, with unread for a red dot) selectable (an icon on the right, if it names one, such as check) or topic (a navigation row with its icon on the left, in a circle, and its title in bold; icon names the symbol, such as currency_pound, or it draws a star). detail gives the value on the right; description, for information and link rows, a line of grey text below the title. Give href to make a row a link, or name and value to tell it apart as a button or switch. Its title is what is written between its tags. A link row with no-arrow has no arrow, as GovKit can draw one for a link that stays in the app. An action row is a single action, as the app's Add vehicle: its title, with an outlined plus on the right in the icon colour, or the icon it names. Anything given slot="control", such as a segmented control, goes at the top of the card, above the rows, as the app's Topics widget has Your topics and All topics. An information or link row given an image, the URL of a picture, draws it on the left at its own size, as the app draws One Login's account icon on Settings (images/one-login.svg, in this component's folder). Proposed, from the future driving designs: content (anything written between its tags, such as a heading and text, 16pt in from the card's edges; with flush, none, for content with its own padding, such as summary columns).

Part `<govuk-app-grouped-list-row>`: One row of the list. Its title is what's written between its tags; its type decides what it draws on the right, and whether it can be pressed.

Attributes:
- `type` (navigation | link | information | detail | toggle | count | selectable | topic | action | content, default navigation): navigation: a chevron, to another screen. link: in the link colour, with an arrow out, to a web page. information: a value on the right, in grey, that can't be pressed. detail: a value on the right in the link colour, such as Off, to change it. toggle: a switch. count: a number on the right. selectable: an icon on the right, if it names one. topic: a navigation row with its icon on the left, in a circle, and its title in bold. action: a single action, with an outlined plus on the right, or the icon it names. content (proposed): anything written between its tags.
- `detail` (string): The value on the right of an information, detail or count row, such as Off or 2.
- `description` (string): A line of grey text below the title of an information or link row.
- `icon` (string): A Material Symbol: on the right of a selectable or action row, such as check, or a topic's on its left, such as currency_pound.
- `image` (string): The address of a picture on the left of an information or link row, at its own size.
- `href` (string): Makes the row a link to this page.
- `name` (string): The name of the row's button or switch, so a page can tell which was pressed or switched.
- `value` (string): Its button's or switch's value, alongside name.
- `checked` (boolean, default false): A toggle row's switch is on.
- `unread` (boolean, default false): A count row has a red dot, for something unread.
- `destructive` (boolean, default false): A detail row's title is red, for something that removes or deletes.
- `no-arrow` (boolean, default false): A link row has no arrow, for a link that stays in the app.
- `flush` (boolean, default false): A content row has no padding, for content with its own, such as summary columns.

Rules:
- Group rows that belong together in one section, and give each section a title unless the screen makes it obvious, as Settings does.
- Use navigation for a row that goes to another screen in the app, and link only for one that opens a web page.
- Use toggle for a setting that takes effect straight away. Use detail for one that is changed on another screen, showing its value, such as Off.
- Use information for a value the user can't change, such as the app's version.
- Keep row titles to one line where you can, and put any explanation in the section's footer, not the row.
- Use destructive only for a detail row that deletes or removes something, such as Sign out.
- Use topic only for a list of the app's topics, as on Home, with the topic's own icon.
- Use a content row for what a row type can't draw, such as a vehicle's name and its tax and MOT, and put anything more about it, such as Details, in a navigation row below. It's proposed, so isn't in the app yet.
- Use the subtle background for cards on a white screen, so they stand apart from it. The accent background is proposed, for a card that's a single action, such as Add vehicle.
- Use an action row on a card of its own, for an action that adds to the list above it, as Add vehicle does.

Avoid:
- For a few points that are read together, and can't be tapped. Instead: `govuk-app-bulleted-list` (see ../components/bulleted-list.md)
- For one destination that should stand out, such as the user's council. Instead: `govuk-app-link-card` (see ../components/link-card.md)
- For the action that moves the journey on. Instead: `govuk-app-button variant="primary"` (see ../components/button.md)
- To switch between views of the same thing, such as Vehicles and Licence. Instead: `govuk-app-segmented-control` (see ../components/segmented-control.md)
- For two to four short facts of the same kind, side by side. Instead: `govuk-app-summary-columns` (see ../components/summary-columns.md)

Example, Every kind of row:
```html
<govuk-app-grouped-list title="Section 1 header" footer="Footer">
  <govuk-app-grouped-list-row name="row-1">Row title 1</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="link" href="https://www.gov.uk">Row title 2</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="information" detail="Detail" description="Body text">Row title 3</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="toggle" name="row-4" checked>Row title 4</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="detail" detail="Body text" name="row-5">Row title 5</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="count" detail="1" unread name="row-6">Row title 6</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="selectable" icon="check" name="row-7">Row title 7</govuk-app-grouped-list-row>
</govuk-app-grouped-list>
```

Example, An action row, as Add vehicle:
```html
<govuk-app-grouped-list>
  <govuk-app-grouped-list-row type="action" name="add-vehicle">Add vehicle</govuk-app-grouped-list-row>
</govuk-app-grouped-list>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/grouped-list/
