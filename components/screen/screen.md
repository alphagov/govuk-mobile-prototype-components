## Writing a screen

Write a screen’s components inside it in the order they appear, top to bottom. The screen sorts them into place:

- a `<govuk-app-nav-bar>` goes at the top, and stays there as the content scrolls under it
- a `<govuk-app-tab-bar>` goes at the bottom, and floats over the content
- anything with `slot="footer"`, usually a `<govuk-app-button-stack>`, is pinned below the content
- everything else is the content, which scrolls

```html
<govuk-app>
  <govuk-app-screen background="modal">
    <govuk-app-nav-bar title="Sign out"></govuk-app-nav-bar>
    <p>If you’re using Face ID or Touch ID to unlock the app, this will be turned off.</p>
    <govuk-app-button-stack slot="footer">
      <govuk-app-button variant="destructive" name="sign-out">Sign out</govuk-app-button>
      <govuk-app-button variant="grouped-secondary" name="cancel">Cancel</govuk-app-button>
    </govuk-app-button-stack>
  </govuk-app-screen>
</govuk-app>
```

## Its size

The screen fills its `<govuk-app>`, so give the root a size, such as a phone’s: `402px` by `874px` for an iPhone 17 Pro. On a page that is the screen, give it the page’s full height instead.

If the status bar and home indicator are drawn over the screen, rather than above and below it, leave room for them on the root. The content starts below the status bar, and a button stack’s buttons end above the home indicator:

```css
govuk-app {
  --govuk-app-inset-top: 62px;
  --govuk-app-inset-bottom: 34px;
}
```

## Known differences from the app

- The app’s screens each set their own spacing. The content here is always 16pt from the edges and 16pt apart, which is the commonest; a component’s own margins add to it.
