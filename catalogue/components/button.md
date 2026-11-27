# Button `<govuk-app-button>`

GOV.UK app component. In the app.

Load: `<script type="module" src="src/components/button/button.js"></script>`

Lets the user take an action, such as continuing a journey, confirming a choice or removing something. It is the app's own button, in five variants: primary, secondary, grouped secondary, compact and destructive, and a sixth, black, for a green screen.

Attributes:
- `variant` (primary | secondary | grouped-secondary | compact | destructive | black, default primary): Which kind of button. black: the main action on a green screen. Anything else draws a primary button.
- `type` (button | submit, default button): submit: pressing it sends the form it's in, with what the user typed or chose, and its own name and value if it has them. button: it does nothing until a page listens for it.
- `disabled` (boolean, default false): Greys the button out, and stops it being pressed or focused.
- `name` (string): Set on the button, so a page listening for clicks can tell one button from another.
- `value` (string): Set on the button, alongside name, to say which of several choices was pressed.

Content: The button's label, as text. Keep it to a few words.

Rules:
- Use a primary button for the main action on a screen, and use at most one.
- Use a grouped secondary button for an alternative to the primary action, directly below it in the same group, as ButtonStackView does.
- Use a secondary button, with its outline, for an alternative action that stands on its own, away from a primary button.
- Use a compact button for a lighter action within the content of a screen, such as on a card, rather than to move the journey on.
- Use a destructive button only for an action that deletes or removes something, such as signing out or removing an account, and usually on a screen that asks the user to confirm it.
- Use a black button in place of a primary button on a green screen, as the app does, and not elsewhere.
- Write the label as a verb that says what will happen: 'Continue', 'Confirm postcode', 'Remove account'. Do not use 'Click here' or 'Submit'.
- Make the button that sends a form's answers a submit button, inside the form, so pressing Return in a field sends them too.
- A button fills the width of what it sits in. Put it in a container to make it narrower.
- Disable a button only while the screen is waiting for something the user has to give first, such as a postcode, and make it clear what that is.

Avoid:
- For an action on the whole screen, such as Close, Done or Edit. Instead: `govuk-app-nav-bar-item` (see ../components/nav-bar.md)
- For a screen's main action and a way out of it, at the bottom of the screen. Instead: `govuk-app-button-stack` (see ../components/button-stack.md)
- For a row that goes to another screen, as on Settings. Instead: `govuk-app-grouped-list-row type="navigation"` (see ../components/grouped-list.md)
- For a link to a web page. Instead: `govuk-app-grouped-list-row type="link"` (see ../components/grouped-list.md)
- For an action that adds to a list, such as Add vehicle. Instead: `govuk-app-grouped-list-row type="action"` (see ../components/grouped-list.md)
- For a few less-used actions on a card, such as Change address. Instead: `govuk-app-menu-button` (see ../components/menu-button.md)
- To switch something on or off straight away. Instead: `govuk-app-grouped-list-row type="toggle"` (see ../components/grouped-list.md)

Example, Primary:
```html
<govuk-app-button name="continue">Continue</govuk-app-button>
```

Example, Primary, disabled until there is something to confirm:
```html
<govuk-app-button disabled>Confirm postcode</govuk-app-button>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/button/
