# Journeys: linking screens, and wiring buttons

Each screen is its own page, so going from one to another is going to another page. Links and back buttons do that with `href`. Buttons do it with a few lines of script on the page.

## Links

Anything that takes an `href` is a real link: use it wherever you can.

- A row that opens another screen: `<govuk-app-grouped-list-row href="registration.html">Add vehicle</govuk-app-grouped-list-row>`.
- A row that opens a web page: `type="link"` and the page's address, such as `https://www.gov.uk/check-mot-history`.
- The back button on a screen pushed on top of another: `<govuk-app-nav-bar title="Your vehicles" back-href="index.html">`, to the screen it came from. Every pushed screen has one; a tab's root and the first screen of a sheet don't.
- An action in the nav bar, such as Close: `<govuk-app-nav-bar-item icon="close" href="../settings/index.html">Close</govuk-app-nav-bar-item>`.
- The tab bar, only on the root of Home, Chat and Settings, links to the others' first screens: copy it from a template page, such as `screens/settings/index.html`, and keep its hrefs.

Paths are relative to the page: `registration.html` beside it, `../settings/index.html` in another journey's folder.

## Buttons

A button goes nowhere of its own. Give it a `name`, and the page listens for clicks and goes where the app would. Put this in the page's `<head>`, after its other scripts, and change `next`:

```html
<script type="module">
  // Buttons go nowhere of their own: the page listens for which was
  // pressed, by its name, and goes where the app would.
  const next = { continue: 'check.html', cancel: 'index.html' }
  document.addEventListener('click', event => {
    const button = event.target.closest('govuk-app button')
    if (next[button?.name]) location.href = next[button.name]
  })
</script>
```

It works for every button a component draws: a `govuk-app-button`, a row or nav bar item with a `name` and no `href`, a grouped list's or section heading's action.

Add `works` to each button the script acts on, such as `<govuk-app-button name="continue" works>Continue</govuk-app-button>`. The prototype rings everything that works when someone taps something that doesn't, so they can find their way; without `works` it can't tell your button does something.

## Somewhere the prototype hasn't got

If a button or row would go to a screen nobody has made, leave it as a named button with no `href` and no `works`, rather than a link to a page that isn't there. Tapping it rings what does work. Mention it to the designer if it matters to the journey.

## Sheets and full-screen covers

A sheet comes up over the screen it was opened from. The sign-out screens in the Settings template show how, in `screens/settings/sign-out.html` if it's here:

- The sheet's first screen: `<govuk-app-sheet present>`, holding the screen it was opened from with `slot="behind"` (only its top shows, so its nav bar and first list are enough), then its own screen, `background="modal"`, with a nav bar that has a close action going back.
- Later screens in the same sheet: `<govuk-app-sheet>` without `present`, as it's already up, and the same screen behind.
- The end of the journey, back to where it started: a link or button to the page it was opened from.

A full-screen cover is the same, with `govuk-app-full-screen-cover`, its close action on the left (`slot="leading"`), and nothing showing behind once it's up. Read the sheet and full-screen cover cards before using either.

## Forms and Return

A screen with a text field can put the field in a `<form>`, so pressing Return on the keyboard carries on, as the app does. Wrap only the field, not the heading above it: the screen spaces what's directly inside it, and a form around both would squash them together.

```html
<govuk-app-heading level="1" size="title-1">What is the vehicle’s registration number?</govuk-app-heading>
<form>
  <govuk-app-text-field name="registration" label="Registration number" hint="For example, AB12 CDE"></govuk-app-text-field>
</form>
```

Listen for `submit` as well as the Continue button, and stop the browser sending the form itself:

```js
document.addEventListener('submit', event => {
  event.preventDefault()
  location.href = 'check.html'
})
```

The answers are saved as they're typed, so nothing needs sending: see [answers-and-branching.md](answers-and-branching.md).
