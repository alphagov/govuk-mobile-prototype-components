# Home header `<govuk-app-home-header>`

GOV.UK app component. In the app.

Load: `<script type="module" src="src/components/home-header/home-header.js"></script>`

Tops the home screen: the GOV.UK wordmark on blue, and the search field the user starts a search of GOV.UK from. It takes the place of the navigation bar, which the home screen hides.

Content: Optionally, a <govuk-app-search-field>, drawn below the wordmark, as on the app's home screen. Without one, the header is the wordmark alone, as when the app's search is turned off.

Rules:
- Use it only on the home screen, in place of a navigation bar. Other screens have a navigation bar.
- Put it first in a <govuk-app-screen>. It sticks to the top of the screen, and the content scrolls under it.
- Give it a search field, as the app does, unless the prototype is of the app without search.
- The wordmark is the screen's heading, so don't give the home screen another level 1 heading.

Avoid:
- On any screen but Home. Instead: `govuk-app-nav-bar` (see ../components/nav-bar.md)
- To search on a screen other than Home. Instead: `govuk-app-search-field` (see ../components/search-field.md)

Example, With search:
```html
<govuk-app-screen>
  <govuk-app-home-header>
    <govuk-app-search-field></govuk-app-search-field>
  </govuk-app-home-header>
  <govuk-app-section-heading action="Edit">Topics</govuk-app-section-heading>
  <p>Driving and transport. Money and tax. Benefits. Care. Health and disability. Parenting and guardianship. Employment.</p>
  <govuk-app-tab-bar>
    <govuk-app-tab-bar-item icon="home" name="home" selected>Home</govuk-app-tab-bar-item>
    <govuk-app-tab-bar-item icon="settings" name="settings">Settings</govuk-app-tab-bar-item>
  </govuk-app-tab-bar>
</govuk-app-screen>
```

Example, Without search:
```html
<govuk-app-screen>
  <govuk-app-home-header></govuk-app-home-header>
  <govuk-app-section-heading action="Edit">Topics</govuk-app-section-heading>
  <p>Driving and transport. Money and tax. Benefits. Care. Health and disability. Parenting and guardianship. Employment.</p>
  <govuk-app-tab-bar>
    <govuk-app-tab-bar-item icon="home" name="home" selected>Home</govuk-app-tab-bar-item>
    <govuk-app-tab-bar-item icon="settings" name="settings">Settings</govuk-app-tab-bar-item>
  </govuk-app-tab-bar>
</govuk-app-screen>
```

Docs: https://alphagov.github.io/govuk-mobile-prototype-components/components/home-header/
