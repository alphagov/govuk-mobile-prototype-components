# Remembering answers, and branching on them

`prototype.js`, on every screen, remembers what's typed and chosen until the browser tab is closed, so a later screen can show it, or go one way or another because of it. Its comment, at the top of `prototype.js`, is the full story; this is how to use it in a journey.

## Saving an answer

Any field with a `name` saves itself as it changes, under that name. Nothing to write:

- A text field: `<govuk-app-text-field name="registration" label="Registration number" hint="For example, AB12 CDE"></govuk-app-text-field>`. Going back to the screen shows what was typed.
- A toggle row: `<govuk-app-grouped-list-row type="toggle" name="reminders">MOT reminders</govuk-app-grouped-list-row>` saves `on` or `off`.

Name answers in lower case with hyphens, for what they are (`registration`, `mot-reminders`), and use the same name everywhere the answer appears.

### Choosing one of a few

A grouped list of `selectable` rows, each a button with the same `name` and its own `value`, isn't a field, so the page saves the choice and moves the tick. Make each `value` the words to show on a later screen, such as `A month before`, so a check screen can show it as it is:

```html
<govuk-app-grouped-list background="subtle">
  <govuk-app-grouped-list-row type="selectable" name="reminder-when" value="A month before" works>A month before</govuk-app-grouped-list-row>
  <govuk-app-grouped-list-row type="selectable" name="reminder-when" value="A week before" works>A week before</govuk-app-grouped-list-row>
</govuk-app-grouped-list>
```

```html
<script type="module">
  import { answers, setAnswer } from '/prototype.js'

  // A choice isn't a field, so save it, and tick the row that was chosen.
  const name = 'reminder-when'
  function tick() {
    for (const row of document.querySelectorAll(`govuk-app-grouped-list-row[name="${name}"]`)) {
      if (row.getAttribute('value') === answers()[name]) row.setAttribute('icon', 'check')
      else row.removeAttribute('icon')
    }
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('govuk-app button')
    if (button?.name === name) {
      setAnswer(name, button.value)
      tick()
    }
  })
  tick()
</script>
```

## Showing an answer

- In words: `<span data-answer="registration">AB12 CDE</span>`, inside a component's content, such as a `govuk-app-text` or a `govuk-app-number-plate`. It shows the answer, or what's written there if there isn't one yet, so write a realistic example: the screen looks right when opened on its own.
- In an attribute, such as a row's `detail` or `description`: `<govuk-app-grouped-list-row type="information" detail="AB12 CDE" data-answer="registration" data-answer-into="detail">Registration number</govuk-app-grouped-list-row>`.

Put `data-answer` with no `data-answer-into` only on a `<span>` (or other plain element) inside a component, never on the component itself: it replaces everything inside what it's on, and would wipe out what the component drew.

## Showing something only sometimes

`data-show-if` on a component shows it only if an answer is as given:

| Shows it if | Write |
| --- | --- |
| the answer is one thing | `data-show-if="fuel=electric"` |
| the answer is anything but | `data-show-if="fuel!=electric"` |
| there's an answer at all | `data-show-if="registration"` |
| there's no answer yet | `data-show-if="!registration"` |

A list that grows as the user adds things, such as saved vehicles, is a card or row for the example already there, and one shown only once there's an answer: `<govuk-app-grouped-list data-show-if="registration">`, with the answer shown inside it. An empty state, such as "You haven't added any vehicles", is `data-show-if="!registration"`. A prototype doesn't need to store a real list: one or two remembered answers is enough to show the idea.

## Going one way or another

Where a journey branches on an answer, the button's script decides where to go:

```html
<script type="module">
  import { answers } from '/prototype.js'

  document.addEventListener('click', event => {
    if (event.target.closest('govuk-app button')?.name !== 'continue') return
    location.href = answers()['has-mot'] === 'yes' ? 'reminders.html' : 'no-mot.html'
  })
</script>
```

## An answer that's missing

To show an error when Continue is pressed with nothing typed, set the field's `error`, with what to do, as the text field card says:

```js
import { answers } from '/prototype.js'

function carryOn() {
  if (!answers().registration?.trim()) {
    document.querySelector('govuk-app-text-field[name="registration"]').setAttribute('error', 'Enter a registration number')
    return
  }
  location.href = 'check.html'
}
```

Only add errors when the designer asks, or the journey is about them: most prototypes don't need them.

## Starting again

The start page has "Start again, forgetting every answer". A button or link with `data-clear-answers` does the same, such as on a last screen that starts the journey over. To screenshot a screen as if answers were given, use `npm run screenshots -- --answers '{"registration":"AB12 CDE"}' <screen>`.
