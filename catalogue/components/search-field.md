# Search field `<govuk-app-search-field>`

Native component. In the app.

Load: `<script type="module" src="components/search-field/search-field.js"></script>`

Lets the user type what they're looking for and search for it, such as searching GOV.UK from the home screen, or filtering a list of countries.

Attributes:
- `placeholder` (string, default Search): What the field says while it's empty, and its name for screen readers unless it has a label.
- `label` (string): Its name for screen readers, if the placeholder doesn't say what it searches, such as Search for a country.
- `value` (string): What is already typed in the field, such as the search the user made to get to a page of results.
- `name` (string, default q): The name what the user typed is sent under when they search.
- `action` (string): The page to go to when the user searches, such as a page of results. Without it, the same page, with what they typed added to its address.

Content: Nothing.

Rules:
- On the home screen, put it in the <govuk-app-home-header>. Elsewhere, put it at the top of the content, above what it searches.
- Leave the placeholder as Search, as the app does everywhere. Where the field searches something narrower than GOV.UK, such as a list of countries, say so to screen readers with a label.
- Give it an action to go to a page of results in a prototype of several pages.

Avoid:
- To search for something on a card of its own, such as a vehicle's registration. Instead: `govuk-app-search-box` (see ../components/search-box.md)
- To ask a question the user answers to carry on, such as their postcode. Instead: `govuk-app-text-field type="postcode"` (see ../components/text-field.md)
- To ask GOV.UK Chat. Instead: `govuk-app-chat-input` (see ../components/chat-input.md)

Example, Empty:
```html
<govuk-app-search-field></govuk-app-search-field>
```

Example, Going to a page of results:
```html
<govuk-app-search-field action="#results"></govuk-app-search-field>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/search-field/
