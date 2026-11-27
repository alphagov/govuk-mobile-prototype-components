# Information page (pattern)

Explains one thing in a few paragraphs, such as how Face ID works in the app or what data it keeps, under a large title, with a back button and at most one action at the bottom.

Use when:
- The user has opened a row in a list to find out about one thing before they act on it.
- The content is a few short paragraphs, and perhaps a bulleted list.
- There is one action that follows from reading it, such as changing a setting or asking for data, or none.

Avoid:
- The screen asks the user to confirm something destructive. Instead: Confirmation (see ../patterns/confirmation.md)
- The screen tells the user that something has finished. Instead: Outcome (see ../patterns/outcome.md)
- The user is choosing between several settings or screens. Instead: Settings list (see ../patterns/settings-list.md)
- The content is long, or changes often, such as guidance from GOV.UK. Instead: Link to the page on GOV.UK, from a link row in a grouped list

Components: [`govuk-app-screen`](../components/screen.md), [`govuk-app-nav-bar`](../components/nav-bar.md), [`govuk-app-text`](../components/text.md), [`govuk-app-bulleted-list`](../components/bulleted-list.md), [`govuk-app-button-stack`](../components/button-stack.md), [`govuk-app-button`](../components/button.md)

Notes:
- In a prototype of several pages, use back-href on the navigation bar, set to the page it was opened from, in place of back.
- Leave out the bulleted list, or the button stack, if the page doesn't need them.
- The button goes nowhere of its own. The page listens for a click on it, by name.

```html
<govuk-app-screen>
  <govuk-app-nav-bar title="Your saved details" large-title back></govuk-app-nav-bar>
  <govuk-app-text>The app keeps a few details about you, so you do not have to enter them each time, like:</govuk-app-text>
  <govuk-app-bulleted-list spacing="compact">
    <govuk-app-bulleted-list-item>your name</govuk-app-bulleted-list-item>
    <govuk-app-bulleted-list-item>your postcode</govuk-app-bulleted-list-item>
  </govuk-app-bulleted-list>
  <govuk-app-text>They stay on this phone. We do not share them with other government services.</govuk-app-text>
  <govuk-app-text>You can delete them at any time.</govuk-app-text>
  <govuk-app-button-stack slot="footer">
    <govuk-app-button name="manage">Manage your saved details</govuk-app-button>
  </govuk-app-button-stack>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/patterns/information-page/
