# Button stack `<govuk-app-button-stack>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/button-stack/button-stack.js"></script>`

Holds a screen's main action, and any way out of it, at the bottom of the screen under a divider, where they stay as the content scrolls. Used on screens that ask the user to do something, such as confirm, agree or continue.

Content: One or two <govuk-app-button> elements, top to bottom: the main action, as a primary or destructive button, then any way out of it as a grouped secondary button. Give the stack slot="footer" to pin it to the bottom of a <govuk-app-screen>.

Rules:
- Put it in a <govuk-app-screen> with slot="footer", so it stays at the bottom as the content scrolls.
- Put the main action first, as a primary button, or a destructive one if it deletes or removes something. Put any way out of it second, as a grouped secondary button, such as Cancel or Not now.
- Use no more than two buttons.
- Don't use it on a screen with a tab bar: the app hides the tab bar on screens that ask the user to act.

Avoid:
- For a lighter action within the content, such as on a card. Instead: `govuk-app-button variant="compact"` (see ../components/button.md)
- For an action on the whole screen that doesn't move the journey on, such as Edit. Instead: `govuk-app-nav-bar-item` (see ../components/nav-bar.md)
- On a top-level screen, with a tab bar. Instead: Put the action on a screen of its own, pushed on top, without the tab bar, and put the button stack there
- For more than two choices. Instead: `govuk-app-grouped-list-row type="navigation"` (see ../components/grouped-list.md)

Example, An action and a way out:
```html
<govuk-app-button-stack>
  <govuk-app-button name="allow">Allow notifications</govuk-app-button>
  <govuk-app-button variant="grouped-secondary" name="not-now">Not now</govuk-app-button>
</govuk-app-button-stack>
```

Example, One button:
```html
<govuk-app-button-stack>
  <govuk-app-button name="continue">Continue</govuk-app-button>
</govuk-app-button-stack>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/button-stack/
