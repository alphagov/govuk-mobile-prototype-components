---
layout: sub-navigation
title: Make a prototype
description: Make a prototype of the GOV.UK app on your computer by asking Claude Code, with no code to write.
sectionKey: Get started
order: 2
---

You can make a prototype of the GOV.UK app by asking [Claude Code](https://code.claude.com/docs/en/overview) for it in plain words. It starts from the app’s own Home, Settings and Chat screens, or a blank screen, and opens in your browser as an iPhone. Claude does the technical parts, and asks before installing anything.

It’s on your computer only, for now: there’s no way to share it yet. It looks like the app on iOS.

## Make one

Make an empty folder for your prototype, and open Claude Code in it. In the Terminal app, this makes one called my-prototype in your Documents folder, and opens Claude Code there:

```sh
mkdir -p ~/Documents/my-prototype && cd ~/Documents/my-prototype && claude
```

Then paste:

> Make me a prototype of the GOV.UK app using https://github.com/alphagov/govuk-mobile-prototype-components

Claude asks what to call it and where in the app to start. If your computer needs Node.js, the free program a prototype runs on, Claude asks before downloading it into your own folder: it doesn’t need your password. Then it makes the prototype in the folder, and opens it in your browser.

If you open Claude Code in a folder that has things in it, such as Documents, Claude makes a new folder for the prototype inside it instead.

Then ask for what you want to change, such as:

> Add a setting called Passport reminders, that opens a screen explaining it

Or describe a whole journey, such as “a journey to add a vehicle and get MOT reminders”, or paste in a Figma link, a screenshot or a photo of a sketch. Claude plans the screens with you first, builds them from the app’s own parts, and checks each one in light and dark before showing you. To check them, it takes pictures of the screens with a browser that runs out of sight: Chrome, if you have it, or, with your say-so, one it downloads.

## Come back to it

Open Claude Code in your prototype’s folder, and say:

> Open my prototype

A prototype keeps the version of the components it was made with. Say “get the latest components” to update it: Claude says what’s new, asks first, and checks your screens afterwards. If Claude made something for your prototype that the library hasn’t got, say “add this to the library” and Claude sends it to the library’s team to review.

## If you’d rather type it

If you have [Node.js](https://nodejs.org/) 22.16 or newer, this makes a prototype called My prototype, starting at Settings, in the folder you run it in:

```sh
npx --yes https://github.com/alphagov/govuk-mobile-prototype-components/releases/latest/download/govuk-mobile-prototype-components.tgz new "My prototype"
```

Add `--from home`, `--from chat` or `--from blank` to start somewhere else, and `--here` to make it in the folder you’re in, if that’s empty. Then open Claude Code in the prototype’s folder, and say “open my prototype”.

## How it’s made

A prototype is a folder of HTML pages that use this library’s components, templates and patterns, from the latest release when the prototype was made, with a small server that reloads the browser when a page changes. It has a `CLAUDE.md` and skills of its own, which tell Claude how to work on it. They come from the library’s `src/starter/` folder.
