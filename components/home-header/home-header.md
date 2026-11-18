## On the home screen

Put the header first in the home screen, with a search field inside it. It stays at the top, and the screen’s content scrolls under it, starting 24pt below it, as the app’s widgets do. Scroll these to see it.

<div class="docs-example">
<div class="docs-example__frames">
{%- for scheme in ["light", "dark"] %}
<govuk-app class="docs-example__screen docs-example__screen--short" colour-scheme="{{ scheme }}">
  <govuk-app-screen>
    <govuk-app-home-header>
      <govuk-app-search-field></govuk-app-search-field>
    </govuk-app-home-header>
    <govuk-app-section-heading action="Edit">Topics</govuk-app-section-heading>
    <p>Driving and transport. Money and tax. Benefits. Care. Health and disability. Parenting and guardianship. Employment. Business. Education and learning. Housing and local services.</p>
    <govuk-app-section-heading>Pages you’ve visited</govuk-app-section-heading>
    <p>Check if you need a UK visa. Renew or replace your adult passport. Check your State Pension age. Tax your vehicle. Find out how much Income Tax you pay.</p>
  </govuk-app-screen>
</govuk-app>
{%- endfor %}
</div>
</div>

## Status bar

The blue fills the status bar, as in the app. If the page draws the status bar above the root, as a phone frame usually does, the blue starts below it. To draw it under the status bar, put the root at the top of the screen and leave room for the status bar by setting `--govuk-app-inset-top` on the root, such as `62px` for an iPhone 17 Pro:

```css
govuk-app {
  --govuk-app-inset-top: 62px;
}
```

## Known differences from the app

- When the user starts searching with the phone on its side, the app hides the wordmark to make room. The header always shows it.
- The app’s status bar is white over the blue. The header can’t set that: it is the phone frame’s to draw.
