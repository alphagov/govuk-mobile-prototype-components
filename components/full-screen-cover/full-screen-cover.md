## Presenting it

A full-screen cover is a page of its own, as a sheet is. To present one from a screen, link to that page, and give the cover `present` there, so it comes up from the bottom when the page loads:

```html
<govuk-app>
  <govuk-app-full-screen-cover present>
    <govuk-app-screen slot="behind">
      …the screen it was presented from…
    </govuk-app-screen>
    <govuk-app-screen background="green">
      …the cover's screen…
    </govuk-app-screen>
  </govuk-app-full-screen-cover>
</govuk-app>
```

Its later screens are pages with the same cover, without `present`. To close it, link back to the screen it was presented from.

## Green screens

The app uses a full-screen cover to add a driver and vehicles account. Its screens are green, the same in light and dark, with white text, a black button, and the close action on the left. The Android app and the app's analytics call them bookends: they come before and after the user signs in on the web. Draw one with:

- `background="green"` on the screen, which also sets its content further down, as the app does
- `size="title-1"` on its text, which the app sets larger than Body
- `variant="black"` on its button
- `slot="leading"` on the navigation bar's close action

## Known differences from the app

- The app's button stack has no divider above the button until the content scrolls under it. On a green screen, there's never one here.
- Its title is 48pt below the navigation bar, on the 8pt grid, as near as it can be to where the app shows it in iOS 26. The app's code asks for 66pt, which its older snapshots show.
- The app's text is 24pt below the title and 16pt below each paragraph. Here it is 16pt below each.
- In landscape, the app sets the title and text a size smaller and the title nearer the top. It doesn't here.
- Closing it goes straight to the page behind: it doesn't slide down first.
