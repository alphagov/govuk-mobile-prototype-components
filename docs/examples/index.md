---
layout: sub-navigation
title: Examples
description: Screens of the app built from the components alone, to see them working together.
sectionKey: Examples
order: 3
---

Each example is a few pages of plain HTML that link to each other, written with nothing but the library’s components. They show how the components fit together, and what’s still missing. They aren’t prototypes to build on: prototypes belong in their own repositories.

## Home

[Open the Home example](/examples/home/)

The Home tab, with the widgets a user sees once they’ve chosen some topics, set their council and visited some pages. For now it is mostly what’s missing, and it will grow as the components it needs are added. Its Settings tab opens the Settings example.

It uses the screen, grouped list, text, button and tab bar. Its source is in `examples/home/` in the repository.

### What’s missing

- **The header.** The library has no blue GOV.UK header with its logo and search box yet, so the screen starts at Topics.
- **Your topics and All topics.** There’s no segmented control yet, so Topics shows only your topics.
- **The topics’ icons.** The grouped list can’t draw images on rows yet.
- **Your local services’ card.** The council is drawn as a link row, rather than in the app’s large, bold link text on a card of its own, without an arrow.
- **Pages you’ve visited without arrows.** They’re link rows, which always show their arrow; the app’s don’t.
- **Give feedback as a link.** It is a grouped secondary button, the nearest the library has.
- **Rows that go nowhere.** The topics, the Edit and See all actions, Give feedback and the Chat tab have no screens of their own here.

## Settings

[Open the Settings example](/examples/settings/)

The Settings tab, using the app’s own wording. Its Home tab opens the Home example. From it you can open Face ID and Your app data, which have back buttons, and sign out, through the sign-out confirmation.

It uses the screen, navigation bar, grouped list, tab bar, heading, text, button and button stack. Its source is in `examples/settings/` in the repository.

### What’s missing

- **Your GOV.UK One Login’s image.** The grouped list can’t draw images on rows yet.
- **Your app data’s bulleted list.** The library has no bulleted list yet, so its two bullets are written as text.
- **Presenting a modal.** The sign-out confirmation opens as a page, rather than sliding up over Settings as a sheet.
- **Rows that go nowhere.** Your accounts, Messages, Notifications and Open source licences have no screens of their own here.
