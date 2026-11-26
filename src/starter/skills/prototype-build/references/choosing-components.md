# Choosing from the catalogue

The catalogue is written for this: each card says what something is for, when it's the wrong choice and what to use instead. Reading it well is most of making a screen look like the app.

## Reading it

1. `<catalogue>/index.md`, all of it. It lists every template, pattern and component in a line each. A line can't tell you when something is wrong, so don't choose from it alone.
2. The cards of your candidates: `<catalogue>/patterns/<name>.md`, `templates/<name>.md`, `components/<name>.md`. Read **Avoid** first: if your case is listed there, follow its "Instead", and read that card too.
3. Each card's **Rules**, and its examples. Copy the example HTML and change it, rather than writing from the attributes list: the examples are what the library checks.
4. A card shows only one or two examples. For the rest, such as a vehicle's card made from a grouped list, read the `examples` in the definition, `<library>/components/<name>/<name>.json`, by name: they're the library's own arrangements, ready to copy.

Don't read every card. Six to ten for a journey is usual: the screen, nav bar and button cards you'll need on most screens, plus the few for what's particular to this one. Keep the cards you've read in mind for the rest of the journey rather than reading them again.

A card marked **not in the app yet** is proposed, from future designs. Use it if it fits, and tell the designer in the plan that it isn't in the app today.

## Which screen is it?

Most screens in a journey are one of these. Start from the pattern where there is one.

| The screen... | Start from |
| --- | --- |
| Lists settings, or things to open, such as a menu or a list of saved vehicles | **Settings list** pattern. Pushed from another screen: `back-href`, no tab bar |
| Explains one thing, with at most one action | **Information page** pattern |
| Asks "are you sure?" before something that can't easily be undone | **Confirmation** pattern, in a sheet |
| Says something has finished | **Outcome** pattern |
| Asks one question the user types the answer to | No pattern: a white screen (`background="modal"`), as the app's own questions are, a nav bar with only its back button, a level 1 heading in `title-1` asking it, a **text field**, and a **button stack** with Continue. See the text field card |
| Asks the user to choose one of a few | No pattern: the same, with a **grouped list** of `selectable` rows, `background="subtle"`, in place of the field. See [answers-and-branching.md](answers-and-branching.md) |
| Shows answers back to check | No pattern: a white screen, a level 1 heading, then a **section** for each part, holding a **grouped list** (`background="subtle"`) of `information` rows, one per answer, and a row with `href` back to the question to change it. Something with its own look goes beside the section's title, such as a number plate with `slot="accessory"`. Confirm in a button stack |
| Is the root of a tab: Home, Chat, Settings | That **template**. Change it, don't rebuild it |
| Shows a vehicle, a licence, a tax or MOT | **Number plate**, **status**, **summary columns**, **section**, **card header**, **menu button**: read their cards, several are proposed |

## Look-alikes

The pairs people mix up most. The cards say the same, at more length.

- **A button, or a row?** A row on a card (`govuk-app-grouped-list-row`) opens another screen (`navigation`), a web page (`link`), or adds to a list (`action`, such as Add vehicle). A **button** moves a journey on, and lives in a **button stack** at the bottom of the screen. A `compact` button is a lighter action inside the content, such as on a card.
- **The button stack, or the nav bar?** Continue, Confirm, Sign out: button stack. Close, Done, Edit, on the whole screen: a `govuk-app-nav-bar-item` in the nav bar.
- **Tab bar, or button stack?** Never both. The tab bar is only on the root of Home, Chat and Settings; a screen pushed on top has a back button and no tab bar.
- **A screen, a sheet or a full-screen cover?** The next step of a journey is a screen pushed on top, with a back button. A task finished or cancelled before going back, such as signing out or choosing a country, is a **sheet**. A journey that takes over the app until it's done, such as adding a driver and vehicles account, is a **full-screen cover**, often on a green screen.
- **Titles.** The screen's title is the nav bar's `title` (`large-title` on a list or a tab's root). A question on a form is a `govuk-app-heading level="1" size="title-1"` with no nav bar title. A title over a list of rows is the grouped list's own `title`. A part of a long screen is a **section**. A widget with Edit or See all is a **section heading**.
- **Text field, search field or search box?** Typing an answer: text field. Searching GOV.UK, or filtering a list: search field. A search on a card of its own, such as checking a vehicle: search box (proposed).
- **On or off.** A setting that takes effect straight away is a `toggle` row in a grouped list, not a toggle on its own.
- **A card on a white screen.** A grouped list is white, so on a white (`modal`) screen give it `background="subtle"`, pale blue, or it vanishes in light mode.
- **A list to read, or rows to tap?** Points read together, not tapped: **bulleted list**. Things to tap: grouped list.
- **One destination that stands out**, such as the user's council: **link card**, not a link row.
- **Something the user should know now**: a **banner** on the screen it's about, not a sheet.

## Icons

Icons are Material Symbols, by name, such as `check`, `directions_car`, `calendar_month` or `notifications`. The app draws SF Symbols, which can only be used on Apple's platforms, so pick the Material Symbol closest to the one in the design. <https://fonts.google.com/icons> lists them, if you need to look one up.

## When nothing fits

First, look again for an arrangement of components that does the job: a section holding a grouped list with a content row, a stack of a number plate and a status, a grouped list with a `selectable` row for each choice, an `information` row with an `image` for a picture on its left (put the picture in the screen's folder, and write its path relative to the page). A screen the app hasn't got can almost always be made from the app's parts. Only something the parts can't draw, such as a map, a chart or a new kind of card from a design, needs [custom-component.md](custom-component.md).
