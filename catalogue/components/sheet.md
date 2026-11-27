# Sheet `<govuk-app-sheet>`

Native component. In the app.

Load: `<script type="module" src="src/components/sheet/sheet.js"></script>`

Presents a screen over the one the user was on, for a task they finish or cancel before going back, such as signing out, finding their local council or choosing a country. The screen it was presented from is set back behind it.

Attributes:
- `present` (boolean, default false): Brings the sheet up from the bottom when the page loads, or when it's added to the page, as UIKit presents it. Give it to the first screen of a modal journey, and not to the screens after it, which are already in the sheet.
- `label` (string): The sheet's name for screen readers, such as Sign out. Leave it off if its screen has a heading or a navigation bar title.

Content: The sheet's screen, a <govuk-app-screen>, usually with background="modal", starting with a <govuk-app-nav-bar> that has a close action. Optionally, the screen it was presented from, with slot="behind", which is drawn set back behind it and can't be used.

Rules:
- Put a sheet directly in a <govuk-app>, in place of a screen. Give the root a size, as for a screen.
- Use a sheet for a task the user finishes or cancels before going back, as the app does: signing out, finding their local council, choosing a country, linking an account.
- Always give the sheet's screen a navigation bar with a close action, so it can be dismissed, even if it has Cancel in a button stack too. The sheet leaves room above the bar for it.
- Draw the screen it was presented from behind it, with slot="behind", so the user can see where they'll go back to.
- Give present only to the first screen of the modal journey. Later screens of the same journey are already in the sheet.

Avoid:
- For a journey that takes over the app until it's done, such as adding a driver and vehicles account. Instead: `govuk-app-full-screen-cover` (see ../components/full-screen-cover.md)
- For the next screen of a journey, pushed on top of the last, with a back button in its navigation bar. Instead: `govuk-app-screen` (see ../components/screen.md)
- For a few things to do with something on a card. Instead: `govuk-app-menu-button` (see ../components/menu-button.md)
- For something the user should know, that they needn't act on. Instead: `govuk-app-banner` (see ../components/banner.md)

Example, With a navigation bar and close action:
```html
<govuk-app-sheet>
  <govuk-app-screen background="modal">
    <govuk-app-nav-bar title="Select a country">
      <govuk-app-nav-bar-item icon="close" name="close">Close</govuk-app-nav-bar-item>
    </govuk-app-nav-bar>
    <govuk-app-text>Get travel alerts for the countries you choose.</govuk-app-text>
  </govuk-app-screen>
</govuk-app-sheet>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/sheet/
