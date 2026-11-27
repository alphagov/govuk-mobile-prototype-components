# Confirmation (pattern)

Asks the user to confirm an action that is hard or impossible to undo, such as signing out or deleting something, before the app does it. It slides up as a modal, with the question, what will happen, and a choice of going ahead or not.

Use when:
- The user has asked to do something destructive or hard to undo, such as signing out, deleting data or removing an account.
- The user needs to know what will happen before they go ahead.
- There are exactly two choices: do it, or go back.

Avoid:
- The action is easy to undo, or loses nothing, such as turning a setting on or off. Instead: Do it straight away, with no confirmation
- The action has already happened, and the screen says so. Instead: Outcome (see ../patterns/outcome.md)
- The screen explains something, and the user isn't choosing whether to go ahead. Instead: Information page (see ../patterns/information-page.md)
- The user has more than two choices, each of which could be a row. Instead: Settings list (see ../patterns/settings-list.md)

Components: [`govuk-app-screen`](../components/screen.md), [`govuk-app-nav-bar`](../components/nav-bar.md), [`govuk-app-heading`](../components/heading.md), [`govuk-app-text`](../components/text.md), [`govuk-app-button-stack`](../components/button-stack.md), [`govuk-app-button`](../components/button.md)

Notes:
- Ask the question in the heading, and say in the text what will happen and whether it can be undone.
- Say what the action does on its button, such as Sign out or Delete saved details, not Yes or Confirm.
- Its buttons go nowhere of their own. The page listens for clicks on them, by name, confirm or cancel, and goes where the app would, as examples/settings/sign-out.html does. Add works to each button the page acts on.
- On iOS it slides up as a sheet over the screen it was opened from. Put it in a govuk-app-sheet, with that screen behind it, to show that.

```html
<govuk-app-screen background="modal">
  <govuk-app-nav-bar>
    <govuk-app-nav-bar-item icon="close" name="cancel">Close</govuk-app-nav-bar-item>
  </govuk-app-nav-bar>
  <govuk-app-heading level="1" size="title-1">Are you sure you want to delete your saved details?</govuk-app-heading>
  <govuk-app-text>You’ll need to enter them again the next time you use this service. You cannot undo this.</govuk-app-text>
  <govuk-app-button-stack slot="footer">
    <govuk-app-button variant="destructive" name="confirm">Delete saved details</govuk-app-button>
    <govuk-app-button variant="grouped-secondary" name="cancel">Cancel</govuk-app-button>
  </govuk-app-button-stack>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/patterns/confirmation/
