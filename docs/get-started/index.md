---
layout: sub-navigation
title: Get started
description: Make a prototype of the GOV.UK app, use the components in your own pages, or work on the library.
sectionKey: Get started
order: 1
---

There are three ways in:

- **[Make a prototype](/get-started/make-a-prototype/)** by asking Claude Code for it in plain words. You don’t need to write any code. Start here if you’re a designer.
- **Use the components in your own pages**, written in HTML. The rest of this page is how.
- **[Work on the library](/get-started/work-on-the-library/)**, to change a component or add one. [Build a component](/get-started/building-a-component/) says how one is put together.

## Install a release

Install a [release](https://github.com/alphagov/govuk-mobile-prototype-components/releases), so the components change only when you choose. Each has the package attached, as a plain download:

```sh
npm install https://github.com/alphagov/govuk-mobile-prototype-components/releases/download/v0.7.0/govuk-mobile-prototype-components.tgz
```

Use a release, not `main` or a commit on it: only a release has the [catalogue](#for-tools-that-build-prototypes). Installing one adds this package alone, with no dependencies, and runs nothing.

The package has the components, patterns and templates, the foundation, the frame, the definitions’ schemas, the catalogue, and the starter and command that make a new prototype. It leaves out the app’s screenshots and the components’ prose, which are only for these docs.

## Use a component

Serve `node_modules/govuk-mobile-prototype-components/` with your pages. Load a component’s script from there, and write its element inside a `<govuk-app>`:

```html
<script type="module" src="node_modules/govuk-mobile-prototype-components/src/components/button/button.js"></script>

<govuk-app>
  <govuk-app-button name="continue">Continue</govuk-app-button>
  <govuk-app-button variant="grouped-secondary" name="skip">Skip</govuk-app-button>
</govuk-app>
```

The script adds everything else the component needs to the page: the app’s colours and type, the root’s styles, and the component’s own stylesheet. It loads them from beside itself, and nothing from another site, so a prototype works offline.

Browsers won’t load scripts like these from a page opened from disk, so serve the folder from any web server, such as:

```sh
python3 -m http.server 8000
```

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

## Put it in a phone

To show a prototype as the app on an iPhone, put its `<govuk-app>` in a `<govuk-prototype-frame>`, and load the frame’s script:

```html
<script type="module" src="node_modules/govuk-mobile-prototype-components/src/frame/frame.js"></script>

<govuk-prototype-frame>
  <govuk-app>
    …
  </govuk-app>
</govuk-prototype-frame>
```

The frame fills the window, with the phone in the middle of it: an iPhone’s screen, with iOS’s status bar and home indicator over the app. It shrinks the phone to fit a window too small for it. The [examples](/examples/) are shown in it.

On a phone, or a window as narrow as one, there’s no phone drawn: the app fills the screen, with the phone’s own status bar over it. So the same page can be tried on a real phone.

- `bare` leaves the phone out in any window, as on a phone.
- `status-bar="light"` draws the status bar white, for a screen dark at its top, such as Home under its blue header. Over a sheet it’s white already, as iOS draws it.

Anything else in the frame, such as a link back to your prototype’s index, goes above the phone, and is hidden when the app fills the screen.

## Inputs and outputs

**Attributes and content are the inputs.** What each component takes is on its [page](/components/), and in its definition file, `src/components/<name>/<name>.json`.

**The browser’s own events are the outputs.** Components draw real buttons and fields, so `click`, `input` and `change` bubble up as usual, carrying the `name` and `value` you gave them:

```js
document.addEventListener('click', event => {
  const button = event.target.closest('govuk-app button')
  if (button) console.log(button.name, button.value)
})
```

## For tools that build prototypes

Everything in the library, its templates, patterns and components with what each is for and when to use another, is in a catalogue generated from the definitions: a short [index](/catalogue/index.md) with a line for each, a card for each to read only when choosing between them, and [catalogue.json](/catalogue/catalogue.json) as data. It’s in every release, in `catalogue/`, but not on `main`.

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

