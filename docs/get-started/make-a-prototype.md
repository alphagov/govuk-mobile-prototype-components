---
layout: sub-navigation
title: Make a prototype
description: Make a prototype of the GOV.UK app on your computer by asking Claude Code, with no code to write.
sectionKey: Get started
order: 2
---

You can make a prototype of the GOV.UK app by asking [Claude Code](https://code.claude.com/docs/en/overview) for it in plain words. It starts from the app’s own Home, Settings and Chat screens, or a blank screen, and opens in your browser as an iPhone. Claude does the technical parts, and asks before installing anything.

It’s on your computer only, for now: there’s no way to share it yet. It looks like the app on iOS.

## Add the plugin to Claude Code

You only need to do this once. Open Claude Code in your terminal, and type these two lines, one at a time:

```text
/plugin marketplace add alphagov/govuk-mobile-prototype-components
/plugin install govuk-app-prototyping@govuk-app
```

The second asks where to install it: choose to install it for you. Then type `/reload-plugins`, or close Claude Code and open it again.

If adding it doesn’t work, your organisation’s Claude Code settings may not allow plugins from places it hasn’t approved. Ask whoever looks after your Claude Code setup to allow `alphagov/govuk-mobile-prototype-components`.

## Make a prototype

Make a folder for your prototypes, such as one called Prototypes in your Documents, and open Claude Code in it. Then say:

> Make a new prototype of the GOV.UK app

Claude asks what to call it and where in the app to start, gets your computer ready (it may need to install Node.js, or Apple’s Command Line Tools, and asks first), and opens it in your browser. Then ask for what you want to change, such as:

> Add a setting called Passport reminders, that opens a screen explaining it

## Come back to it

Open Claude Code in your prototype’s folder, and say:

> Open my prototype

## How it’s made

The plugin is in this repository’s `plugin/` folder. A prototype is a folder of HTML pages that use this library’s components, templates and patterns, installed from GitHub at the latest release when the prototype is made, with a small server that reloads the browser when a page changes. Claude keeps a history of every change in the folder, so you can ask it to undo one.
