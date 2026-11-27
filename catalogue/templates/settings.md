# Settings (template)

The app’s Settings tab and every screen it opens in the app today: Face ID, Your app data, and signing out, through the confirmation, to You’ve signed out. Their pages link to each other as the app’s screens do.

Use when:
- Prototyping a new setting, or a change to an existing one.
- Prototyping a new screen opened from Settings, such as a page about the user’s account or data.
- Prototyping a journey that starts in Settings, such as signing out or managing notifications.
- Testing a change to the wording of Settings or the screens it opens.

Screens, in the repository and the package:
- Settings: src/templates/settings/index.html. The root of the Settings tab, with the app’s own rows. Face ID, Your app data and Sign out open the other screens.
- Face ID: src/templates/settings/face-id.html. Opened from the Face ID row. Explains Face ID, with a button to change it in the phone’s settings, and a back button to Settings.
- Your app data: src/templates/settings/your-app-data.html. Opened from the Your app data row. Explains the data the app keeps, with a button to request it, and a back button to Settings.
- Are you sure you want to sign out?: src/templates/settings/sign-out.html. Opened from the Sign out row, as a sheet over Settings. Sign out goes on to You’ve signed out; Cancel and close return to Settings.
- You’ve signed out: src/templates/settings/signed-out.html. After signing out. Signing in again returns to Settings.

Components: [`govuk-app-screen`](../components/screen.md), [`govuk-app-nav-bar`](../components/nav-bar.md), [`govuk-app-grouped-list`](../components/grouped-list.md), [`govuk-app-tab-bar`](../components/tab-bar.md), [`govuk-app-text`](../components/text.md), [`govuk-app-bulleted-list`](../components/bulleted-list.md), [`govuk-app-heading`](../components/heading.md), [`govuk-app-button`](../components/button.md), [`govuk-app-button-stack`](../components/button-stack.md), [`govuk-app-sheet`](../components/sheet.md)

Notes:
- Copy the whole folder, so the screens keep linking to each other. Delete the screens you don’t need, and the rows that open them.
- Each page has a comment at its top saying what to change and what to leave.
- Your accounts, Messages, Notifications and Open source licences go nowhere, as the library has no screens for them. Give a row an href to a page of yours to make it open one.
- Home and Chat on the tab bar open the Home and Chat templates, if they’re beside this one.
- Signing out and signing in again only move between pages: nothing is remembered.
- Unlike the app, Your GOV.UK One Login has no GOV.UK One Login picture on its left. The app’s picture is only for this repository’s docs, so it isn’t in the package, and an information row can’t draw an icon in its place.

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/templates/settings/about/
