---
layout: sub-navigation
title: Get started
description: Use the components to build a prototype app journey in HTML.
sectionKey: Get started
order: 1
---

## Use a component

Load the component’s script, and write its element inside a `<govuk-app>`:

```html
<script type="module" src="components/button/button.js"></script>

<govuk-app>
  <govuk-app-button name="continue">Continue</govuk-app-button>
  <govuk-app-button variant="grouped-secondary" name="skip">Skip</govuk-app-button>
</govuk-app>
```

The script adds everything else the component needs to the page: the app’s colours and type, the root’s styles, and the component’s own stylesheet.

## The root, `<govuk-app>`

The app’s colours and type exist only inside `<govuk-app>`.

- `colour-scheme="light"` or `"dark"` fixes the scheme. Otherwise it follows the device.
- Its size and position are the page’s to set.
- `highlight-actions` shows what can be tapped when a tap goes nowhere. See [show what works](#show-what-works).

Prototype pages shouldn’t style anything inside `<govuk-app>`. If a page loads stylesheets of its own, such as GOV.UK Frontend, load them into a cascade layer, so none of their styles reach the components:

```html
<style>
  @import url("/assets/govuk-frontend.min.css") layer(page);
</style>
```

See [styles stay apart](/get-started/building-a-component/#styles-stay-apart) for why.

## Inputs and outputs

**Attributes and content are the inputs.** What each component takes is on its [page](/components/), and in its definition file, `components/<name>/<name>.json`.

**The browser’s own events are the outputs.** Components draw real buttons and fields, so `click`, `input` and `change` bubble up as usual, carrying the `name` and `value` you gave them:

```js
document.addEventListener('click', event => {
  const button = event.target.closest('govuk-app button')
  if (button) console.log(button.name, button.value)
})
```

## Show what works

A prototype only works where you’ve made it work. Add `highlight-actions` to the root, and a tap that goes nowhere rings everything that works for a moment, so whoever is trying the prototype can find it:

```html
<govuk-app highlight-actions>
```

Links, fields and switches work. So do buttons a component acts on itself, such as a segmented control’s segments. A button only does something when your page listens for it, so say which ones do: add `works` to the component.

```html
<govuk-app-button name="sign-out" works>Sign out</govuk-app-button>
<govuk-app-grouped-list-row name="licences" works>Open source licences</govuk-app-grouped-list-row>
```

On a grouped list or section heading, `works` is for its action, such as Edit.

A tap goes nowhere if, within a third of a second, the page doesn’t leave or change, and no menu opens: tapping text, or a button no one listens for. So a button’s listener should go somewhere or change the page. One that only logs to the console counts as going nowhere.

## Serve the page

Browsers won’t load modules from a page opened from disk, so serve the folder from any static server:

```sh
python3 -m http.server 8000
```

## Run this site locally

To work on the components or this site, you need Node.js 26, the version in `.nvmrc`. Anything from 22.16 works:

```sh
npm install
npm start
```

Then open <http://localhost:8080>. The site reloads when you change a component, its definition or a page.
