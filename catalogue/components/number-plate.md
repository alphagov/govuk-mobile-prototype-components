# Number plate `<govuk-app-number-plate>`

GOV.UK app component. In the app.

Load: `<script type="module" src="components/number-plate/number-plate.js"></script>`

Shows a vehicle's registration number as it looks on the vehicle: on a yellow number plate, in the DVLA's own typeface. Small on a vehicle's card, large on its detail screen. A white front plate, blank, stands for any vehicle, such as on a search for one.

Attributes:
- `size` (small | large, default small): small, as on a vehicle's card, growing with the text size; large, as on a vehicle's detail screen.
- `variant` (rear | front, default rear): rear: yellow, as the app shows a vehicle's registration. front: white, with a thicker stroke, as the app draws the blank ABC plate on its vehicle search.

Content: The registration number, as it's written on the plate, such as AB71 CDE.

Rules:
- Use it only for a vehicle's registration number.
- Write the registration as it's shown on the plate, in capitals, with its space, such as AB71 CDE.
- Use small beside a vehicle's name, such as on its card, and large on its own on the vehicle's detail screen.
- Use the rear plate for a vehicle's registration. Use the front plate for a blank one, ABC, that stands for any vehicle, such as on a search for one.

Avoid:
- For any other number or reference, such as a driving licence number. Instead: `govuk-app-grouped-list-row type="information"` (see ../components/grouped-list.md)
- For the user to type in a registration. Instead: `govuk-app-search-box` (see ../components/search-box.md)
- For a vehicle's other facts, such as its year or fuel. Instead: `govuk-app-labelled-icon` (see ../components/labelled-icon.md)

Example, Small:
```html
<govuk-app-number-plate>AB71 CDE</govuk-app-number-plate>
```

Example, Front, blank, as on a vehicle search:
```html
<govuk-app-number-plate variant="front">ABC</govuk-app-number-plate>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/number-plate/
