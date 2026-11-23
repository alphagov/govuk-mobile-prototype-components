## In a form

Put the field in a form, so pressing Return on the keyboard sends what the user typed to the form's `action`, as the field's `name`. A prototype can then show the next page, or the same page with an error:

```html
<form action="council.html">
  <govuk-app-heading level="1" size="title-1">What is your postcode?</govuk-app-heading>
  <govuk-app-text-field type="postcode" name="postcode" label="Postcode" hint="For example SW1A 2AA"></govuk-app-text-field>
</form>
```

## Errors

The app shows an error above the field, in red, and moves VoiceOver to it. Here, the field tells screen readers it's invalid, and they hear the error after its label and hint when they reach it. To show one, set `error`, for example when the page loads with an empty postcode.

## Known differences from the app

- The keyboard is the phone's or computer's own, not iOS's.
- The field shows it's being typed in with the yellow focus outline as well as its caret, as the app's other controls do when they're focused from a keyboard.
- Screen readers aren't moved to the error when it appears.
