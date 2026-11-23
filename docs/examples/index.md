---
layout: sub-navigation
title: Examples
description: Screens of the app built from the components alone, to see them working together.
sectionKey: Examples
order: 3
---

Each example is a few pages of plain HTML that link to each other, written with nothing but the library’s components. They show how the components fit together, and what’s still missing. They aren’t prototypes to build on: prototypes belong in their own repositories.

On a phone, an example fills the screen. Shake the phone to get back to this page. On an iPhone, Safari first asks whether the page can use motion, the first time you tap it. Shaking only works over HTTPS, so not when the site is served from your computer on the local network.

## Home

[Open the Home example](/examples/home/)

The Home tab, with the widgets a user sees once they’ve chosen some topics, set their council and visited some pages. For now it is mostly what’s missing, and it will grow as the components it needs are added. Its Settings tab opens the Settings example.

It uses the screen, home header, search field, grouped list, segmented control, text, button, crown and tab bar. Its source is in `examples/home/` in the repository.

### What’s missing

- **Searching.** The search field works, but there are no previous searches or results to show while searching.
- **Your local services’ card.** The council is drawn as a link row, rather than in the app’s large, bold link text on a card of its own, without an arrow.
- **Give feedback as a link.** It is a grouped secondary button, the nearest the library has.
- **Rows that go nowhere.** The topics other than Driving, the Edit and See all actions, Give feedback and the Chat tab have no screens of their own here. Driving opens the Driving example.

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

## Settings

[Open the Settings example](/examples/settings/)

The Settings tab, using the app’s own wording. Its Home tab opens the Home example. From it you can open Face ID and Your app data, which have back buttons, and sign out, through the sign-out confirmation.

The sign-out confirmation slides up as a sheet, with Settings set back behind it. It uses the screen, sheet, navigation bar, grouped list, tab bar, heading, text, bulleted list, button and button stack. Its source is in `examples/settings/` in the repository.

### What’s missing

- **Your GOV.UK One Login’s image.** The grouped list can’t draw images on rows yet.
- **Rows that go nowhere.** Your accounts, Messages, Notifications and Open source licences have no screens of their own here.
