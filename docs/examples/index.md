---
layout: sub-navigation
title: Examples
description: Screens of the app built from the components alone, to see them working together.
sectionKey: Examples
order: 4
---

Each example is a few pages of plain HTML that link to each other, written with nothing but the library’s components. They show how the components fit together, and what’s still missing. They aren’t prototypes to build on: prototypes belong in their own repositories.

On a phone, an example fills the screen. Shake the phone to get back to this page. On an iPhone, Safari first asks whether the page can use motion, the first time you tap it. Shaking only works over HTTPS, so not when the site is served from your computer on the local network.

Not everything in an example goes somewhere. Tap something that doesn’t, and everything that does is ringed for a moment, in yellow: each example’s root has [`highlight-actions`](/get-started/use-the-components/#show-what-works).

## Home

[Open the Home example](/examples/home/)

The Home tab, with the widgets a user sees once they’ve chosen some topics, set their council and visited some pages. For now it is mostly what’s missing, and it will grow as the components it needs are added. Its Chat and Settings tabs open the Chat and Settings examples.

It uses the screen, home header, search field, grouped list, segmented control, section heading, link card, text, button, crown and tab bar. Its source is in `examples/home/` in the repository.

### What’s missing

- **Searching.** The search field works, but there are no previous searches or results to show while searching.
- **Give feedback as a link.** It is a grouped secondary button, the nearest the library has.
- **Rows that go nowhere.** The topics other than Driving, the Edit and See all actions and Give feedback have no screens of their own here. Driving opens the Driving example.

## Driving

[Open the Driving example](/examples/driving/)

The future driving designs, from a screenshot of Figma: a driver’s vehicles and licence, with the segmented control between them, and a vehicle’s details. Its back button returns to Home, which opens it from the Driving topic.

The licence has four states. The app would show whichever applies, so here each is a page of its own:

- [Valid, and expiring](/examples/driving/licence.html)
- [Expired](/examples/driving/licence-expired.html)
- [Disqualified](/examples/driving/licence-disqualified.html)
- [Revoked](/examples/driving/licence-revoked.html)

Much of it is proposed, not in the app yet: the status, count, card header, strong and search box, the yellow warning banner, and the grouped list’s content rows, accent background and full-width dividers. Its number plates, menu buttons, labelled icons, address, sections, segmented control and Add vehicle are the app’s own. It also uses the screen, navigation bar, grouped list, summary columns, stack, heading, text, button and tab bar. Its source is in `examples/driving/` in the repository.

### What’s missing

- **Checking a vehicle.** Whatever registration is typed, the search shows the Lamborghini.
- **The plate’s size on a vehicle’s card.** The designs’ plate is a little larger than the app’s, and further from the vehicle’s name.
- **Screens that go nowhere.** The Volvo’s details, Tech specs, MOT history, the driver record’s History, Add vehicle and Renew have no screens here.

## Chat

[Open the Chat example](/examples/chat/)

The Chat tab: GOV.UK Chat, using the app’s own wording. A new chat has the welcome message and questions to try. Asking the first, about renewing a passport, or typing a question and sending it, shows it being answered, then, after a few seconds, the answer, with the GOV.UK pages it used. Clear chat, in the menu beside the field, starts a new chat.

The pages are plain HTML, so they move on with a link, a form and a page that refreshes, with no script of their own. It uses the screen, heading, text, bulleted list, link, chat answer, chat question, chat loading, chat example questions, chat input, menu button and tab bar. Its source is in `examples/chat/` in the repository.

### What’s missing

- **Other answers.** The other questions to try go nowhere, and whatever is typed, the answer is about renewing a passport.
- **Onboarding.** The app asks the user to agree to GOV.UK Chat’s terms before their first chat. Those screens aren’t here.
- **The menu’s other items.** Privacy notice, About and Give feedback go nowhere here.
- **Clearing the chat.** The app asks the user to confirm in an alert first. Here it starts a new chat straight away.

### Proposals

Proposed changes to GOV.UK Chat, from a researcher’s mockups, as props for research sessions. Each is a conversation of its own, on the Chat tab:

- [Using saved info](/examples/chat/universal-credit.html): Chat asks to use details the app has saved, and the user chooses which. Each detail’s info button says where the app got it. What would they choose, and what would they need to know to decide?
- [Remembering what you tell it](/examples/chat/register-to-vote.html): Chat asks for an address, and the app picks up whatever is typed, to use again, in a yellow note set apart from Chat’s answers. Its link opens everything the app has picked up from chats, as a sheet, where each thing can be removed. How does it feel, and what controls would they expect?

The saved details and the note of what was picked up are the example’s own, not the library’s, as the app doesn’t have them: they’re in `examples/chat/proposals/`, drawn the same way as the library’s, so either could join it later. The conversations also use the sheet, navigation bar and grouped list.

Chat only answers what each conversation was written for, and anything else it says it can’t answer. The info picked up from chats is all back each time it opens.

## Settings

[Open the Settings example](/examples/settings/)

The Settings tab, using the app’s own wording. Its Home tab opens the Home example. From it you can open Face ID and Your app data, which have back buttons, and sign out, through the sign-out confirmation.

The sign-out confirmation slides up as a sheet, with Settings set back behind it. It uses the screen, sheet, navigation bar, grouped list, tab bar, heading, text, bulleted list, button and button stack. Its source is in `examples/settings/` in the repository.

### What’s missing

- **Rows that go nowhere.** Your accounts, Messages, Notifications and Open source licences have no screens of their own here.

## Young people

[Open the Young people example](/examples/young-people/)

An idea from the young people workstream: an app that grows up with its user. It's Home, with a section of its own at the top for a young person, saying what they can do at their age. Above the phone, choose which age to show it at:

- [16](/examples/young-people/): four things to do first, as tiles, such as getting a National Insurance number and registering to vote. See more shows four more.
- [18](/examples/young-people/18.html): more to do, grouped by Jobs, Housing, Education and Civic duties.

Getting a National Insurance number opens a screen of its own, with a back button. The other tiles and rows open their pages on GOV.UK.

None of it is in the app. The age card, the tiles and their grid are the example’s own, not the library’s: they’re in `examples/young-people/proposals/`, drawn like the app’s Home, with a link card’s corners and shadow and a topic’s icons, so they could join the library later. The groups at 18 are the library’s grouped list. It also uses the screen, home header, search field, segmented control, section heading, link card, navigation bar, text, bulleted list, button, button stack, crown and tab bar. Its source is in `examples/young-people/` in the repository.

### What’s missing

- **How the app knows your age.** It might come from GOV.UK One Login, or the user might tell it. Here, you choose.
- **Screens for the other tiles.** Only the National Insurance number has one.
- **Choosing an age on a phone.** The ages are above the phone, which isn't shown when the example fills a phone's screen. Open the 18 page from its link here instead.
- **Rows that go nowhere.** As in the Home example, most topics and the Edit and See all actions have no screens here.
