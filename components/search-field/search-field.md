## Searching

When the user taps the field, Cancel appears beside it, and stays until they press it, as on the app’s home screen. While they type, a button in the field clears what they typed. Cancel clears it too, and puts the field back as it was. Try it in the header below.

<div class="docs-example">
<div class="docs-example__frames">
{%- for scheme in ["light", "dark"] %}
<govuk-app class="docs-example__screen docs-example__screen--short" colour-scheme="{{ scheme }}">
  <govuk-app-screen>
    <govuk-app-home-header>
      <govuk-app-search-field></govuk-app-search-field>
    </govuk-app-home-header>
    <govuk-app-section-heading action="Edit">Topics</govuk-app-section-heading>
    <p>Driving and transport. Money and tax. Benefits. Care.</p>
  </govuk-app-screen>
</govuk-app>
{%- endfor %}
</div>
</div>

Pressing Search on the keyboard sends the form to its `action`, with what the user typed as `q`, so a prototype of several pages can show a page of results for it:

```html
<govuk-app-search-field action="results.html"></govuk-app-search-field>
```

In the app, starting a search swaps the home screen’s widgets for the user’s previous searches, and Cancel swaps them back. To do the same in one page, listen for the field being focused and for Cancel being pressed:

```js
document.addEventListener('focusin', event => {
  if (event.target.matches('[type="search"]')) showPreviousSearches()
})

document.addEventListener('click', event => {
  if (event.target.closest('button[name="cancel"]')) showWidgets()
})
```

## Icons

The app’s magnifier and clear button are SF Symbols, which may only be used on Apple’s platforms, so the field draws [Material Symbols](https://fonts.google.com/icons) instead, rounded: `search` and `cancel`.

## Known differences from the app

- The app’s snapshots only show the field before the user taps it. While they are searching, the field draws Cancel as the app’s code sets it, as text. iOS 26 may draw it differently.
- The field shows it is being typed in by its caret and Cancel, as iOS does, without the yellow focus outline other components have.
- The keyboard is the phone’s or computer’s own, not iOS’s.
