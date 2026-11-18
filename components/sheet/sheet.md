## Presenting it

A sheet is a page of its own. To present one from a screen, link to that page, and give the sheet `present` there, so it comes up from the bottom when the page loads:

```html
<govuk-app>
  <govuk-app-sheet present>
    <govuk-app-screen slot="behind">
      …the screen it was presented from…
    </govuk-app-screen>
    <govuk-app-screen background="modal">
      …the sheet's screen…
    </govuk-app-screen>
  </govuk-app-sheet>
</govuk-app>
```

Its later screens are pages with the same sheet, without `present`. To close it, link back to the screen it was presented from.

## Known differences from the app

- The gap above the sheet, its corners and how far the screen behind is set back are the system’s, which the app’s snapshots don’t show, so they’re approximate.
- Closing it goes straight to the page behind: it doesn’t slide down first.
- It can’t be pulled down to close it, as the app’s sheets can unless they ask not to be.
- The status bar doesn’t turn white over the black behind the sheet, as iOS’s does in light mode.
