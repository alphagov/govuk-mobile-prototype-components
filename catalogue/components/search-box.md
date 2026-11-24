# Search box `<govuk-app-search-box>`

GOV.UK app component. **Not in the app yet**: proposed, from a screenshot of the future driving designs in Figma, until there’s a link to the file.

Load: `<script type="module" src="components/search-box/search-box.js"></script>`

Lets the user type what they're looking for where they are and search for it, on a card of its own with a search button, such as a vehicle's registration to check its tax and MOT. A hint of what to type, such as a blank number plate, can sit inside it.

Attributes:
- `placeholder` (string): What the box shows until the user types, such as Start, as the designs have it, or Search for a vehicle.
- `label` (string): The box's name for screen readers, such as Registration number. Without it, they hear its placeholder.
- `name` (string, default q): The name what the user typed is sent as.
- `value` (string): Text already in the box.
- `action` (string): Where the search goes, such as the page of results. Without it, the page it's on.

Content: Optionally, an element with slot="accessory", inside the box after the text, hinting at what to type, such as <govuk-app-number-plate variant="front">ABC</govuk-app-number-plate>. Screen readers don't hear it.

Rules:
- Put it in a section that says what it searches for, such as Check a vehicle, with a description, such as View information for any vehicle.
- Give it a label saying what to type, such as Registration number, when its placeholder doesn't: screen readers don't hear its accessory.
- Give it an accessory only where it shows what to type, as a blank number plate does for a registration.
- For a search bar in the system's style, such as at the top of a screen or a list, use the search field.

Avoid:
- To search GOV.UK, or filter a list, such as of countries. Instead: `govuk-app-search-field` (see ../components/search-field.md)
- To ask a question on a form, with a button below to carry on. Instead: `govuk-app-text-field` (see ../components/text-field.md)
- To ask GOV.UK Chat. Instead: `govuk-app-chat-input` (see ../components/chat-input.md)

Example, A vehicle's registration, with a blank number plate:
```html
<govuk-app-section title="Check a vehicle" description="View information for any vehicle">
  <govuk-app-search-box placeholder="Start" label="Registration number" name="registration" action="#vehicle">
    <govuk-app-number-plate slot="accessory" variant="front">ABC</govuk-app-number-plate>
  </govuk-app-search-box>
</govuk-app-section>
```

Example, Without an accessory:
```html
<govuk-app-section title="Find your local council" description="Check which council looks after where you live">
  <govuk-app-search-box placeholder="Postcode" name="postcode" action="#council"></govuk-app-search-box>
</govuk-app-section>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/search-box/
