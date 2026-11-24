# Screen `<govuk-app-screen>`

Native component. In the app.

Load: `<script type="module" src="components/screen/screen.js"></script>`

Lays out one screen of the app: the navigation bar at the top, the content, which scrolls, and the tab bar or a button stack at the bottom. Write a screen's components inside it in order, top to bottom.

Attributes:
- `background` (page | modal | green | chat, default page): page: the app's pale blue, for screens in its sections. modal: white, for a screen presented over them, such as a question or a confirmation. green: the app's green, the same in light and dark, with white text and its content set further down, for a screen that takes over the app, in a full-screen cover. chat: GOV.UK Chat's, the same pale blue, with its conversation kept below the status bar and above the chat input, rather than scrolling under them, as the app's chat screen does.

Content: The screen's components, top to bottom. A <govuk-app-nav-bar>, or the home screen's <govuk-app-home-header>, goes at the top and sticks there. A <govuk-app-tab-bar> goes at the bottom of the content and floats over it. An element with slot="footer", usually a <govuk-app-button-stack>, is pinned below the content, with the tab bar below it if there is one, as GOV.UK Chat's field is. Everything else is the content, 16pt in from the sides and 16pt apart, and scrolls.

Rules:
- Put a screen directly in a <govuk-app>, and give the root a size: the screen fills it, and scrolls inside it.
- Use one screen for each screen of a journey. In a prototype of several pages, put each on its own page.
- Give a screen either a tab bar or a button stack, not both: the app hides the tab bar on screens that ask the user to act. GOV.UK Chat's field is the one footer the app shows above its tab bar.
- Use the modal background for screens presented over the app, such as a sign-out confirmation, and the page background for the rest.
- Use the green background only for a screen that takes over the app, in a full-screen cover, as the app does when adding a driver and vehicles account. Give it a black button.
- Use the chat background for GOV.UK Chat's screens, with a chat input in its footer.

Avoid:
- For a task over the screen the user was on, such as signing out. Instead: A govuk-app-sheet, with the screen inside it (see ../components/sheet.md)
- For a journey that takes over the app until it's done. Instead: A govuk-app-full-screen-cover, with the screen inside it (see ../components/full-screen-cover.md)
- For a part of a screen. Instead: `govuk-app-section` (see ../components/section.md)

Example, A modal screen with buttons:
```html
<govuk-app-screen background="modal">
  <p>If you’re using Face ID or Touch ID to unlock the app, this will be turned off. You can turn it on again the next time you sign in.</p>
  <govuk-app-button-stack slot="footer">
    <govuk-app-button variant="destructive" name="sign-out">Sign out</govuk-app-button>
    <govuk-app-button variant="grouped-secondary" name="cancel">Cancel</govuk-app-button>
  </govuk-app-button-stack>
</govuk-app-screen>
```

Example, A page pushed on top, with a button:
```html
<govuk-app-screen>
  <govuk-app-nav-bar title="Your app data" back></govuk-app-nav-bar>
  <p>We store a small amount of data about you to improve your experience in the app.</p>
  <p>You can ask for a copy of it.</p>
  <govuk-app-button-stack slot="footer">
    <govuk-app-button name="request">Request your data</govuk-app-button>
  </govuk-app-button-stack>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/screen/
