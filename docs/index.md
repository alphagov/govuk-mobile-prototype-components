---
homepage: true
layout: product
title: GOV.UK app prototype components
description: Web components that look and behave like the GOV.UK app’s own, so you can build a prototype app journey by writing HTML.
startButton:
  href: /get-started/
  text: Get started
---

## What this is

A library of components for prototyping the GOV.UK app. Each one matches a component in the iOS and Android apps, in how it looks and how it behaves, so a prototype looks like the real app without anyone writing Swift or Kotlin.

Each component is a custom element. You write its tag in plain HTML, inside a `<govuk-app>`:

```html
<govuk-app>
  <govuk-app-button name="continue">Continue</govuk-app-button>
  <govuk-app-button variant="grouped-secondary" name="skip">Skip</govuk-app-button>
</govuk-app>
```

There are no frameworks and no build step: load a component’s script and it brings everything else it needs.

## How we build them

- **Match the app.** Each component copies its app counterpart, from the iOS and Android source and the app’s own screenshots.
- **Self-contained.** A component carries all the HTML, CSS and JavaScript needed to draw it, so it can be used on its own.
- **Every component has a definition file.** It says what the component is for, what it takes and gives back, the rules for using it, and what it was built from. Each [component’s page](/components/) is drawn from it.

## Find out more

- [Get started](/get-started/): make a prototype, use the components in your own pages, or work on the library.
- [Build a component](/get-started/building-a-component/): add one to the library.
- [Components](/components/): every component, drawn live beside the app’s screenshots.
