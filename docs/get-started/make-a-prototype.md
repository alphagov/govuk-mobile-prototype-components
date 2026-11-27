---
layout: get-started
title: Make a prototype
description: Make a prototype of the GOV.UK app on your computer by asking Claude Code, with no code to write.
sectionKey: Get started
order: 2
---

{% from "copy-box.njk" import copyBox %}

You can make a prototype of the GOV.UK app by asking [Claude Code](https://code.claude.com/docs/en/overview) for it in plain words. It starts from the app’s own Home, Settings and Chat screens, or a blank screen, and opens in your browser as an iPhone. Claude does the technical parts, and asks before installing anything.

It’s on your computer only, for now: there’s no way to share it yet. It looks like the app on iOS.

## Before you start

You need:

- a Mac with Claude Code set up: if you can’t open it, ask whoever set up your laptop
- an internet connection, as Claude downloads the app’s screens and parts
- to be allowed to install a free program called Node.js, if your Mac hasn’t got it: Claude asks first, and it goes in your own folder, so it doesn’t need your password

## Make one

### 1. Open Claude Code in an empty folder

Open the Terminal app, paste this and press Return. It makes an empty folder called my-prototype, in a Prototypes folder in your Documents, and opens Claude Code there:

{{ copyBox("mkdir -p ~/Documents/Prototypes/my-prototype && cd ~/Documents/Prototypes/my-prototype && claude", "command") }}

To make another prototype later, change my-prototype to a new name, in both places.

### 2. Ask for a prototype

Paste this into Claude:

{{ copyBox("Make me a prototype of the GOV.UK app using https://github.com/alphagov/govuk-mobile-prototype-components") }}

Claude asks what to call it and where in the app to start. If your Mac needs Node.js, Claude asks before downloading it. Then it makes the prototype in the folder, and opens it in your browser.

Claude asks before it runs or installs anything. Say yes when you’re happy, and ask it what anything means.

If you open Claude Code in a folder that has things in it, such as Documents, Claude makes a new folder for the prototype inside it instead. Then, next time, open Claude Code in that new folder.

## Change it

Ask for what you want, in the same place. For a bigger change, Claude plans the screens with you first, and waits for your yes. It builds them from the app’s own parts, and checks each one in light and dark before showing you. To check them, it takes pictures of the screens with a browser that runs out of sight: Chrome, if you have it, or, with your say-so, one it downloads.

Try these, or your own ideas.

A small change:

{{ copyBox("Add a setting called Passport reminders that opens a screen explaining it.") }}

A change to one of the app’s screens:

{{ copyBox("On the Home screen, add a card near the top telling me my driving licence expires in 3 weeks. It should open a screen saying what to do.") }}

A journey that remembers your answers:

{{ copyBox("Make a journey to add a vehicle and get MOT reminders. Ask for the registration number and when I want reminding, then show my answers on a check screen before I confirm.") }}

Something that can’t be undone:

{{ copyBox("In Settings, let me remove a saved vehicle, with a screen asking me to confirm first.") }}

Different paths for different answers:

{{ copyBox("Ask whether I have a UK passport. If yes, ask for the passport number. If no, show a screen listing other ID I can use.") }}

Chat:

{{ copyBox("Change Chat so the example questions are about council tax, and make the first one lead to an answer about paying it.") }}

From a picture: drag a screenshot or a photo of a sketch into the Terminal window, or paste in a Figma link, then ask:

{{ copyBox("Make this screen.") }}

Dark mode:

{{ copyBox("Show me what it looks like in dark mode.") }}

## Come back to it

Open the Terminal app, and open Claude Code in your prototype’s folder:

{{ copyBox("cd ~/Documents/Prototypes/my-prototype && claude", "command") }}

Then say:

{{ copyBox("Open my prototype") }}

A prototype keeps the version of the components it was made with. Say “get the latest components” to update it: Claude says what’s new, asks first, and checks your screens afterwards. If Claude made something for your prototype that the library hasn’t got, say “add this to the library” and Claude sends it to the library’s team to review.

## If something goes wrong

- Tell Claude what you see, in your own words. It can usually sort it out.
- Ask it to undo the last change, or go back to an earlier version.
- If the page in your browser has gone, say “open my prototype”.

## If you’d rather type it

If you have [Node.js](https://nodejs.org/) 22.16 or newer, this makes a prototype called My prototype, starting at Settings, in the folder you run it in:

{{ copyBox('npx --yes https://github.com/alphagov/govuk-mobile-prototype-components/releases/latest/download/govuk-mobile-prototype-components.tgz new "My prototype"', "command") }}

Add `--from home`, `--from chat` or `--from blank` to start somewhere else, and `--here` to make it in the folder you’re in, if that’s empty. Then open Claude Code in the prototype’s folder, and say “open my prototype”.

## How it’s made

A prototype is a folder of HTML pages that use this library’s components, templates and patterns, from the latest release when the prototype was made, with a small server that reloads the browser when a page changes. It has a `CLAUDE.md` and skills of its own, which tell Claude how to work on it. They come from the library’s `src/starter/` folder.
