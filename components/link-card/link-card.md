## More than one

When the user's area has two councils, the app shows a card for each, under a sentence saying so, with a description on each saying what that council does:

```html
<govuk-app-section-heading action="Edit" name="edit-local-services">Your local services</govuk-app-section-heading>
<govuk-app-text>Services in your area are provided by 2 local councils</govuk-app-text>
<govuk-app-link-card href="https://www.derbyshire.gov.uk" description="County councils are usually responsible for services like education, social care and transport">Derbyshire County Council</govuk-app-link-card>
<govuk-app-link-card href="https://www.derbyshiredales.gov.uk" description="District, borough and city councils are usually responsible for services like rubbish, council tax and housing">Derbyshire Dales District Council</govuk-app-link-card>
```

## Known differences from the app

- In the app, two cards are closer together than other things on Home. In a screen, they're as far apart as anything else.
- Screen readers hear the card as a link, with its description and name. The app's VoiceOver reads them separately, the name as a link that opens a web page.
