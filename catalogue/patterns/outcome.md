# Outcome (pattern)

Tells the user that something has finished, such as signing in or out, with a short centred heading and line of text, and one action to go on.

Use when:
- Something the user did has finished, and they need to know before they go on, such as after signing out or signing in.
- There is one obvious next step.
- The screen ends a journey, or a step in one, and the user can't go back into it.

Avoid:
- The user hasn't done it yet, and is choosing whether to. Instead: Confirmation (see ../patterns/confirmation.md)
- The screen needs more than a line or two to explain things. Instead: Information page (see ../patterns/information-page.md)
- The user has several things they could do next. Instead: Settings list (see ../patterns/settings-list.md)
- The user has two things they could do next. Instead: A screen with a primary and a grouped secondary button in the button stack

Components: [`govuk-app-screen`](../components/screen.md), [`govuk-app-heading`](../components/heading.md), [`govuk-app-text`](../components/text.md), [`govuk-app-button-stack`](../components/button-stack.md), [`govuk-app-button`](../components/button.md)

Notes:
- Say what happened in the heading, in the past tense, and what it means for the user in the text.
- It has no navigation bar: the user goes on with its button, not back.
- Its button goes nowhere of its own. The page listens for a click on it, by name, as examples/settings/signed-out.html does.

```html
<govuk-app-screen background="modal">
  <govuk-app-heading level="1" align="center">Your saved details have been deleted</govuk-app-heading>
  <govuk-app-text align="center">You can add them again at any time in Settings</govuk-app-text>
  <govuk-app-button-stack slot="footer">
    <govuk-app-button name="continue">Continue</govuk-app-button>
  </govuk-app-button-stack>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/patterns/outcome/
