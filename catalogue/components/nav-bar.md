# Navigation bar `<govuk-app-nav-bar>`

Native component. In the app.

Load: `<script type="module" src="src/components/nav-bar/nav-bar.js"></script>`

Says which screen the user is on, takes them back to the screen they came from, and holds the screen's actions, such as close, done or edit. It sits at the top of every screen that isn't a top-level one, and of some that are.

Attributes:
- `title` (string): The screen's title, drawn in the bar as the screen's heading. Leave it off where the content starts with its own heading.
- `large-title` (boolean, default false): Draws the title large, below the bar. It scrolls with the content, and the title appears in the bar once it has gone under it.
- `back` (boolean, default false): Shows a back button, named back, for the page to listen for.
- `back-href` (string): Shows a back button that is a link to this page. Use it in place of back in a prototype of several pages.

Content: Up to three <govuk-app-nav-bar-item> elements, the screen's actions, drawn on the right in order. One with slot="leading" is drawn on the left instead, where the back button would be, as the app draws close on a full-screen cover. Each takes an icon attribute, the name of a Material Symbol (such as close, check or more_horiz), or none, to draw its text instead; an href, to make it a link to another page, or name and value, to tell it apart as a button. What is written between its tags is its text, or, with an icon, its name for screen readers.

Part `<govuk-app-nav-bar-item>`: One of the screen's actions in the bar: its text, or with an icon, its name for screen readers.

Attributes:
- `icon` (string): A Material Symbol to draw, such as close, check or more_horiz, in place of its text.
- `href` (string): Makes it a link to this page.
- `name` (string): Without an href, makes it a button with this name, so a page listening for clicks can tell which was pressed.
- `value` (string): Set on the button, alongside name, to say which of several it was.

Rules:
- Put it first in the screen, before the content. It sticks to the top of the screen and the content scrolls under it.
- Give a screen a title unless its content starts with its own heading, as the app's forms do, such as What is your address?
- Use a large title where the app does, such as Settings and Pages you've visited. Use the inline title on other screens, and on forms and modals.
- Show a back button on every screen pushed on top of another, and never on a top-level screen or the first screen of a modal.
- Close a modal with an action on the right, icon close, named for what it does. Confirm one with icon check.
- Use icons for the actions iOS draws as icons (close, check, more_horiz for a menu). Use a word, such as Edit, for anything else.
- Put close on the left, with slot="leading", only on a full-screen cover, as the app does: a sheet has it on the right.
- Keep titles short enough to fit on one line. A long title is cut off.

Avoid:
- On Home. Instead: `govuk-app-home-header` (see ../components/home-header.md)
- For the action that moves the journey on, such as Continue. Instead: `govuk-app-button-stack` (see ../components/button-stack.md)
- To move between the app's sections, Home, Chat and Settings. Instead: `govuk-app-tab-bar` (see ../components/tab-bar.md)
- For a heading within the content, such as a form's question. Instead: `govuk-app-heading level="1" size="title-1"` (see ../components/heading.md)

Example, Back and an inline title:
```html
<govuk-app-nav-bar title="Notifications" back></govuk-app-nav-bar>
```

Example, Large title:
```html
<govuk-app-nav-bar title="Settings" large-title></govuk-app-nav-bar>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/nav-bar/
