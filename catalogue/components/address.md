# Address `<govuk-app-address>`

GOV.UK app component. In the app.

Load: `<script type="module" src="src/components/address/address.js"></script>`

Shows a person's name and postal address, such as who a vehicle is registered to, or who holds a driving licence.

Attributes:
- `name` (string): The person's name, in bold above the address, such as Mrs Jane Bloggs. Leave it off for an address alone.

Content: The address's lines, each on a line of its own, or separated by <br>. Blank lines and indents are left out, so they can be written however reads best in the HTML.

Rules:
- Write the name and address as the service holds them: the app shows DVLA's records as they are, which may be in capitals.
- Put each part of the address on a line of its own, ending with the postcode.
- Give it a heading that says whose address it is and why, such as Registered to.
- Don't show an address the user hasn't proved is theirs, such as in a vehicle check for any vehicle.

Avoid:
- For one fact about a place, such as a postcode on its own. Instead: `govuk-app-grouped-list-row type="information"` (see ../components/grouped-list.md)
- To ask the user for their postcode. Instead: `govuk-app-text-field type="postcode"` (see ../components/text-field.md)
- For a place the user can go to, such as their local council. Instead: `govuk-app-link-card` (see ../components/link-card.md)

Example, A name and address:
```html
<govuk-app-address name="Mrs Jane Bloggs">
  75 St John's Street
  Gateshead
  NE8 2ED
</govuk-app-address>
```

Example, An address alone:
```html
<govuk-app-address>
  Central Bedfordshire Council<br>
  Priory House<br>
  Chicksands<br>
  SG17 5TQ
</govuk-app-address>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/address/
