---
layout: sub-navigation
title: Examples
description: Screens of the app built from the components alone, to see them working together.
sectionKey: Examples
order: 3
---

Each example is a few pages of plain HTML that link to each other, written with nothing but the library’s components. They show how the components fit together, and what’s still missing. They aren’t prototypes to build on: prototypes belong in their own repositories.

## Settings

[Open the Settings example](/examples/settings/)

The Settings tab, using the app’s own wording. From it you can open Face ID and Your app data, which have back buttons, and sign out, through the sign-out confirmation.

It uses the screen, navigation bar, grouped list, tab bar, heading, text, button and button stack. Its source is in `examples/settings/` in the repository.

### What’s missing

- **Your GOV.UK One Login’s image.** The grouped list can’t draw images on rows yet.
- **Your app data’s bulleted list.** The library has no bulleted list yet, so its two bullets are written as text.
- **Presenting a modal.** The sign-out confirmation opens as a page, rather than sliding up over Settings as a sheet.
- **Rows that go nowhere.** Your accounts, Messages, Notifications and Open source licences have no screens of their own here.
