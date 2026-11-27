# Settings list (pattern)

A screen of settings and links, in grouped lists, for the user to scan and choose from. Each row opens a screen, opens a web page, shows a value or turns something on or off.

Use when:
- The user needs to see and change several settings or preferences in one place.
- A section of the app needs a menu of the screens and pages under it, such as account, privacy and help.
- Rows fall into a few groups, each with an optional title above and line of explanation below.
- It is the root screen of a tab, such as Settings.

Avoid:
- The screen asks the user to confirm one action, such as signing out or deleting something. Instead: Confirmation (see ../patterns/confirmation.md)
- The screen explains one thing in paragraphs, with at most one action. Instead: Information page (see ../patterns/information-page.md)
- The screen tells the user that something has finished. Instead: Outcome (see ../patterns/outcome.md)
- The user is filling in details, such as a name or registration number. Instead: A screen with the text field and a primary button in the button stack

Components: [`govuk-app-screen`](../components/screen.md), [`govuk-app-nav-bar`](../components/nav-bar.md), [`govuk-app-grouped-list`](../components/grouped-list.md), [`govuk-app-tab-bar`](../components/tab-bar.md)

Notes:
- Keep the tab bar only on a tab's root screen. A list pushed from another screen has a back button in its navigation bar instead, and no tab bar.
- Put a destructive row, such as Sign out, in a group of its own, last.
- Give each row that opens a screen an href to that page, in place of its name, in a prototype of several pages.

```html
<govuk-app-screen>
  <govuk-app-nav-bar title="Settings" large-title></govuk-app-nav-bar>

  <govuk-app-grouped-list footer="A line under a group, to explain the rows in it.">
    <govuk-app-grouped-list-row type="information" description="name@example.com">Your account</govuk-app-grouped-list-row>
    <govuk-app-grouped-list-row type="link" href="https://www.gov.uk">Manage your account</govuk-app-grouped-list-row>
  </govuk-app-grouped-list>

  <govuk-app-grouped-list>
    <govuk-app-grouped-list-row type="detail" detail="Off" name="notifications">Notifications</govuk-app-grouped-list-row>
    <govuk-app-grouped-list-row name="face-id">Face ID</govuk-app-grouped-list-row>
    <govuk-app-grouped-list-row type="toggle" name="statistics" checked>Share app usage statistics</govuk-app-grouped-list-row>
  </govuk-app-grouped-list>

  <govuk-app-grouped-list title="Privacy and legal">
    <govuk-app-grouped-list-row type="link" href="https://www.gov.uk">Privacy notice</govuk-app-grouped-list-row>
    <govuk-app-grouped-list-row type="link" href="https://www.gov.uk">Terms and conditions</govuk-app-grouped-list-row>
    <govuk-app-grouped-list-row name="your-data">Your app data</govuk-app-grouped-list-row>
  </govuk-app-grouped-list>

  <govuk-app-grouped-list>
    <govuk-app-grouped-list-row type="detail" destructive name="sign-out">Sign out</govuk-app-grouped-list-row>
  </govuk-app-grouped-list>

  <govuk-app-tab-bar>
    <govuk-app-tab-bar-item icon="home" name="home">Home</govuk-app-tab-bar-item>
    <govuk-app-tab-bar-item icon="chat_bubble" name="chat">Chat</govuk-app-tab-bar-item>
    <govuk-app-tab-bar-item icon="settings" name="settings" selected>Settings</govuk-app-tab-bar-item>
  </govuk-app-tab-bar>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/patterns/settings-list/
