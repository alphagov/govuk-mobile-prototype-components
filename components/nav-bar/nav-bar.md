## Over a screen

The navigation bar sticks to the top of the screen, and the content scrolls under it. A large title scrolls with the content, and moves into the bar once it has gone under it. Scroll these to see it.

<div class="docs-example">
<div class="docs-example__frames">
{%- for scheme in ["light", "dark"] %}
<govuk-app class="docs-screen docs-screen--flush" colour-scheme="{{ scheme }}">
  <govuk-app-nav-bar title="Pages you’ve visited" large-title back>
    <govuk-app-nav-bar-item name="edit">Edit</govuk-app-nav-bar-item>
  </govuk-app-nav-bar>
  <div class="docs-screen__content">
    <p>November 2026</p>
    <p>Check if you need a UK visa. Renew or replace your adult passport. Check your State Pension age. Tax your vehicle. Find out how much Income Tax you pay. Register to vote. Apply for a provisional driving licence.</p>
    <p>October 2026</p>
    <p>Get an MOT reminder. Check if you can get Pension Credit. Apply for a Blue Badge. Find your local council. Report a problem with a road. Check bin collection days. Pay your council tax.</p>
  </div>
</govuk-app>
{%- endfor %}
</div>
</div>

## Status bar

The bar starts at the top of `<govuk-app>`. To leave room for a status bar drawn above it, set `--govuk-app-inset-top` in the root’s `style`, such as `62px` for an iPhone 17 Pro:

```html
<govuk-app style="--govuk-app-inset-top: 62px">
```

## Icons

The app’s actions use SF Symbols, which may only be used on Apple’s platforms, so the bar draws [Material Symbols](https://fonts.google.com/icons) instead, rounded. Give an action any symbol’s name as its `icon`. The closest to the app’s are `close`, `check` and `more_horiz`.

## Known differences from the app

- The glass is a blurred, translucent fill. It doesn’t bend the content behind it, or catch the light at its edges.
- Content going under the bar is blurred and faded, as iOS 26 does, but not as smoothly.
- The large title doesn’t stretch when the screen is pulled down, and the title fades into the bar rather than sliding.
- The back button doesn’t offer a menu of earlier screens when it is held down.
