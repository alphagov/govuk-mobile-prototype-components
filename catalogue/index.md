# GOV.UK app prototype components: catalogue

Web components that look and behave like the GOV.UK app’s own, for prototyping app journeys in HTML. Generated from the definitions by `npm run catalogue`: don’t edit it by hand. Docs: https://alphagov.github.io/govuk-mobile-prototype-components/

Read this index first. Then read the cards it links to, each a few hundred words, only for what you might use. All of it, as data: ../catalogue.json.

## How to choose

1. **A template or pattern that fits.** Start from it, and change its words. A pattern is one whole screen; a template is a journey of several.
2. **Otherwise, components.** Put a screen together from them, following each one’s rules.
3. **Build something custom only when nothing fits.** Match the library’s look: style it with the `--app-*` tokens in foundation/tokens.css, for colour, type and spacing on the 8pt grid. Tell the user it isn’t one of the app’s components.

Don’t choose from this index alone: a line here can’t say when something is the wrong choice. Read the cards of your candidates, and the cards their “Avoid” entries point to, then decide.

A component marked **not in the app yet** is proposed, from future designs. Use it if it fits, and tell the user it isn’t in the app today.

## How a page is put together

- Write the components inside one `<govuk-app>`, with one `<govuk-app-screen>` in it for each screen. Put it in a `<govuk-prototype-frame>` (frame/frame.js) to show it on an iPhone.
- Load each component’s script, given on its card: `<script type="module" src="components/button/button.js"></script>`.
- Components send no events of their own: their buttons, links and fields do, with the `name` and `value` given them. A page listens for clicks by name, and goes where the app would. Add `works` to a button the page acts on.
- Use Material Symbols names for icons, such as `check` or `directions_car`.

Every screen uses: [Screen](components/screen.md), [Navigation bar](components/nav-bar.md), [Heading](components/heading.md), [Text](components/text.md), [Button](components/button.md), [Button stack](components/button-stack.md).

## Patterns

- [Confirmation](patterns/confirmation.md): Asks the user to confirm an action that is hard or impossible to undo, such as signing out or deleting something, before the app does it.
- [Information page](patterns/information-page.md): Explains one thing in a few paragraphs, such as how Face ID works in the app or what data it keeps, under a large title, with a back button and at most one action at the bottom.
- [Outcome](patterns/outcome.md): Tells the user that something has finished, such as signing in or out, with a short centred heading and line of text, and one action to go on.
- [Settings list](patterns/settings-list.md): A screen of settings and links, in grouped lists, for the user to scan and choose from.

## Templates

None yet.

## Components

### Screens and structure

- [Screen](components/screen.md) `govuk-app-screen`: Lays out one screen of the app: the navigation bar at the top, the content, which scrolls, and the tab bar or a button stack at the bottom.
- [Navigation bar](components/nav-bar.md) `govuk-app-nav-bar`: Says which screen the user is on, takes them back to the screen they came from, and holds the screen's actions, such as close, done or edit.
- [Tab bar](components/tab-bar.md) `govuk-app-tab-bar`: Moves between the app's top-level sections: Home, Chat and Settings.
- [Sheet](components/sheet.md) `govuk-app-sheet`: Presents a screen over the one the user was on, for a task they finish or cancel before going back, such as signing out, finding their local council or choosing a country.
- [Full-screen cover](components/full-screen-cover.md) `govuk-app-full-screen-cover`: Presents a screen over the one the user was on, covering it entirely, for a journey that takes over the app until it's finished or closed, such as adding a driver and vehicles account.
- [Section](components/section.md) `govuk-app-section`: Groups part of a screen under a title, with a line saying what it's for if it needs one, and spaces it from what's above, so a long screen reads as a few clear parts: such as Check vehicle details, Status or Registered to.
- [Stack](components/stack.md) `govuk-app-stack`: Lays out a few components in a row or a column, lined up and spaced as a screen needs, where no other component already does: such as a vehicle's number plate and menu button side by side on the right of its card, as the future driving designs show them.

### Text

- [Heading](components/heading.md) `govuk-app-heading`: Titles a screen, or a section of one.
- [Text](components/text.md) `govuk-app-text`: A paragraph of the app's text: Body, as most of it is, or a smaller style for details such as dates, captions and supporting information.
- [Strong](components/strong.md) `govuk-app-strong`: **Not in the app yet.** Makes a few words of a line bold, where they say what the rest of it is, such as Expired before a date, or 1 year 28 days before remaining.
- [Section heading](components/section-heading.md) `govuk-app-section-heading`: Heads a section of a screen, such as a widget on the home screen, with an action for the whole section beside it if it has one, such as Edit or See all.
- [Bulleted list](components/bulleted-list.md) `govuk-app-bulleted-list`: Lists a few short points, each after a bullet, usually finishing a sentence that comes before it, such as what the app stores about the user or what sharing statistics shares.
- [Link](components/link.md) `govuk-app-link`: Makes a few words of a line a link, such as a GOV.UK page named in one of GOV.UK Chat's answers.

### Actions

- [Button](components/button.md) `govuk-app-button`: Lets the user take an action, such as continuing a journey, confirming a choice or removing something.
- [Button stack](components/button-stack.md) `govuk-app-button-stack`: Holds a screen's main action, and any way out of it, at the bottom of the screen under a divider, where they stay as the content scrolls.
- [Menu button](components/menu-button.md) `govuk-app-menu-button`: Offers a few more things the user can do with something on a card, such as a vehicle or a driving licence, without crowding the card: a round “…” button that opens a menu of them.

### Lists and cards

- [Grouped list](components/grouped-list.md) `govuk-app-grouped-list`: A section of rows on a rounded card, as on the Settings screen: rows that go to another screen, open a web page, switch something on or off, or show a value.
- [Link card](components/link-card.md) `govuk-app-link-card`: Makes one destination stand out, on a card of its own that's a link, with its name large and bold, such as the user's council on Home.
- [Summary columns](components/summary-columns.md) `govuk-app-summary-columns`: Lays out a few short facts side by side, in equal columns with a divider between them, so they can be taken in at a glance: a vehicle's year, fuel and colour, a driver's offences and points, or a vehicle's tax and MOT.
- [Card header](components/card-header.md) `govuk-app-card-header`: **Not in the app yet.** Shows at a glance how something on a card stands, when it needs attention: the top of the card in a colour for its state, holding its title, such as Disqualified, Revoked or Expired.

### Inputs and controls

- [Text field](components/text-field.md) `govuk-app-text-field`: Asks the user to type a short answer, such as their postcode, under a heading asking the question, with a hint of what to type and, if what they typed won't do, an error saying what to do.
- [Search field](components/search-field.md) `govuk-app-search-field`: Lets the user type what they're looking for and search for it, such as searching GOV.UK from the home screen, or filtering a list of countries.
- [Search box](components/search-box.md) `govuk-app-search-box`: **Not in the app yet.** Lets the user type what they're looking for where they are and search for it, on a card of its own with a search button, such as a vehicle's registration to check its tax and MOT.
- [Toggle](components/toggle.md) `govuk-app-toggle`: Switches something on or off straight away, such as sharing app usage statistics.
- [Segmented control](components/segmented-control.md) `govuk-app-segmented-control`: Switches between two or three views of the same thing, side by side, such as a driving account's Vehicles and Licence, or Your topics and All topics.

### Facts and statuses

- [Status](components/status.md) `govuk-app-status`: **Not in the app yet.** Shows the state of something with a deadline or a validity, such as a vehicle's tax or MOT, or a driving licence: an icon for its state, then what it is and how it stands, such as Valid, 23 days, or Expired.
- [Count](components/count.md) `govuk-app-count`: **Not in the app yet.** Shows how many of something there are, big enough to take in at a glance, such as a driver's offences and penalty points.
- [Labelled icon](components/labelled-icon.md) `govuk-app-labelled-icon`: Shows a short fact with an icon that says what kind of fact it is, such as a vehicle's year with a calendar, its fuel with a pump, or its colour with a palette.
- [Number plate](components/number-plate.md) `govuk-app-number-plate`: Shows a vehicle's registration number as it looks on the vehicle: on a yellow number plate, in the DVLA's own typeface.
- [Address](components/address.md) `govuk-app-address`: Shows a person's name and postal address, such as who a vehicle is registered to, or who holds a driving licence.
- [Banner](components/banner.md) `govuk-app-banner`: Tells the user something they should know now, on the screen it's about: an alert on Home, such as an emergency, or a warning, such as that driving without tax can invalidate their insurance.

### Home

- [Home header](components/home-header.md) `govuk-app-home-header`: Tops the home screen: the GOV.UK wordmark on blue, and the search field the user starts a search of GOV.UK from.
- [Crown](components/crown.md) `govuk-app-crown`: Ends the home screen: the crown, which grows and fades in as the user scrolls to the end, so they can tell there is nothing more below it.

### Chat

- [Chat question](components/chat-question.md) `govuk-app-chat-question`: Shows a question the user asked GOV.UK Chat, in a dark blue bubble at the right of the conversation.
- [Chat answer](components/chat-answer.md) `govuk-app-chat-answer`: Shows GOV.UK Chat's answer to a question, on a white card the width of the conversation, with the GOV.UK pages it used and a warning to check them.
- [Chat loading](components/chat-loading.md) `govuk-app-chat-loading`: Shows that GOV.UK Chat is busy: Sending... while the user's question is sent, then Generating your answer…, with the app's animation, until the answer comes.
- [Chat input](components/chat-input.md) `govuk-app-chat-input`: Where the user asks GOV.UK Chat a question, pinned below the conversation: a field that grows as they type, a send button once there's a question, and a menu of things to do with the chat, such as clearing it.
- [Chat example questions](components/chat-example-questions.md) `govuk-app-chat-example-questions`: Suggests questions to ask GOV.UK Chat, at the start of a new chat, under the welcome message.
