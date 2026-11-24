# Text field `<govuk-app-text-field>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/text-field/text-field.js"></script>`

Asks the user to type a short answer, such as their postcode, under a heading asking the question, with a hint of what to type and, if what they typed won't do, an error saying what to do.

Attributes:
- `label` (string, required): The field's name for screen readers, such as Postcode. It isn't shown: the heading above asks the question.
- `hint` (string): Shown above the field, in grey, saying what to type, such as For example SW1A 2AA.
- `error` (string): Shown above the field, in red, when what the user typed won't do, saying what to do, such as Enter your postcode.
- `type` (text | email | tel | url | password | postcode, default text): What's typed, so the phone shows the keyboard for it. postcode types in capitals, with the browser offering the user's own.
- `name` (string): The name what the user typed is sent as, in a form.
- `value` (string): Text already in the field.
- `placeholder` (string): What the field shows until the user types. The app's postcode field has none: put what to type in the hint, which stays.
- `autocomplete` (string): What the browser may fill in for the user, such as email or postal-code.

Rules:
- Put it under a heading asking the question, such as What is your postcode?, and give it a label for screen readers with the answer's name, such as Postcode.
- Ask for one thing on a screen, with a primary button below to carry on.
- Put an example in the hint, not the placeholder, so it's still there once the user starts typing.
- Say what to do in the error, not what went wrong: Enter your postcode, not Postcode is empty.
- Put it in a form, so pressing Return on the keyboard sends it.

Avoid:
- To search. Instead: `govuk-app-search-field` (see ../components/search-field.md)
- To ask GOV.UK Chat. Instead: `govuk-app-chat-input` (see ../components/chat-input.md)
- For something that's on or off. Instead: `govuk-app-toggle` (see ../components/toggle.md)
- For a choice from a short list. Instead: `govuk-app-grouped-list-row type="selectable"` (see ../components/grouped-list.md)

Example, A postcode:
```html
<govuk-app-heading level="1" size="title-1">What is your postcode?</govuk-app-heading>
<govuk-app-text-field type="postcode" name="postcode" label="Postcode" hint="For example SW1A 2AA"></govuk-app-text-field>
```

Example, With an error:
```html
<govuk-app-heading level="1" size="title-1">What is your postcode?</govuk-app-heading>
<govuk-app-text-field type="postcode" name="postcode" label="Postcode" hint="For example SW1A 2AA" error="Enter your postcode"></govuk-app-text-field>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/text-field/
