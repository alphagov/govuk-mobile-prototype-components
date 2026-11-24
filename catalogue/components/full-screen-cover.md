# Full-screen cover `<govuk-app-full-screen-cover>`

Native component. In the app.

Load: `<script type="module" src="components/full-screen-cover/full-screen-cover.js"></script>`

Presents a screen over the one the user was on, covering it entirely, for a journey that takes over the app until it's finished or closed, such as adding a driver and vehicles account. Unlike a sheet, nothing of the screen behind shows.

Attributes:
- `present` (boolean, default false): Brings the cover up from the bottom when the page loads, as UIKit presents it. Give it to the first screen of the journey, and not to the screens after it, which are already in the cover.
- `label` (string): The cover's name for screen readers. Leave it off if its screen has a heading or a navigation bar title.

Content: The cover's screen, a <govuk-app-screen>. Optionally, the screen it was presented from, with slot="behind", which is seen only while the cover comes up over it, and can't be used.

Rules:
- Put a full-screen cover directly in a <govuk-app>, in place of a screen. Give the root a size, as for a screen.
- Use a sheet for most modals, as the app does. Use a full-screen cover only where the app does: for a journey that takes over the app, such as adding a driver and vehicles account.
- Give its screen a way out: a close action on the left of its navigation bar, with slot="leading". It can't be pulled down to close.
- Give present only to the first screen of the journey. Later screens of the same journey are already in the cover.
- To draw the app's green screens, give its screen background="green", its text size="title-1", and its button variant="black".

Avoid:
- For a task the user finishes or cancels before going back, such as signing out or choosing a country. Instead: `govuk-app-sheet` (see ../components/sheet.md)
- For the next screen of a journey, pushed on top of the last. Instead: A govuk-app-screen of its own, with a back button in its navigation bar (see ../components/screen.md)
- For a few things to do with something on a card. Instead: `govuk-app-menu-button` (see ../components/menu-button.md)

Example, Adding a driver and vehicles account:
```html
<govuk-app-full-screen-cover>
  <govuk-app-screen background="green">
    <govuk-app-nav-bar>
      <govuk-app-nav-bar-item icon="close" name="close" slot="leading">Close</govuk-app-nav-bar-item>
    </govuk-app-nav-bar>
    <govuk-app-heading level="1" size="large-title">Add your driver and vehicles account</govuk-app-heading>
    <govuk-app-text size="title-1">Keep track of your licence details, tax and MOT dates.</govuk-app-text>
    <govuk-app-text size="title-1">We’ll take you to your web browser to sign in.</govuk-app-text>
    <govuk-app-button-stack slot="footer">
      <govuk-app-button variant="black" name="continue">Continue</govuk-app-button>
    </govuk-app-button-stack>
  </govuk-app-screen>
</govuk-app-full-screen-cover>
```

Example, Coming up over the screen it was presented from:
```html
<govuk-app-full-screen-cover present>
  <govuk-app-screen slot="behind">
    <govuk-app-nav-bar title="Driving" large-title back></govuk-app-nav-bar>
    <govuk-app-text>Add your driver and vehicles account to see your licence details, tax and MOT dates.</govuk-app-text>
  </govuk-app-screen>
  <govuk-app-screen background="modal">
    <govuk-app-nav-bar title="A full-screen cover">
      <govuk-app-nav-bar-item icon="close" name="close" slot="leading">Close</govuk-app-nav-bar-item>
    </govuk-app-nav-bar>
    <govuk-app-text>Nothing of the screen behind shows once it's up.</govuk-app-text>
  </govuk-app-screen>
</govuk-app-full-screen-cover>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/full-screen-cover/
