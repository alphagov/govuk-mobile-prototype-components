---
layout: sub-navigation
title: Build a prototype in HTML
description: Write a prototype’s pages yourself, with the components, for developers and for tools that build prototypes.
sectionKey: Get started
eleventyNavigation:
  parent: Get started
order: 3
---

A prototype is a few HTML pages that link to each other, each one screen of the app. This page is how to write them yourself, with the components, in a project of your own.

There are quicker ways in:

- **[Make a prototype](/get-started/make-a-prototype/)** by asking Claude Code for it, with no code to write.
- **[Use the `new` command](/get-started/make-a-prototype/#if-you-d-rather-type-it)** to get a prototype with its server and first screens, without Claude. Then change its pages as below.
- **Start from a [template](/templates/)**, one of the app’s real screens as a whole page: copy it, and point its scripts at where you serve the package.

## 1. Install a release

Install a [release](https://github.com/alphagov/govuk-mobile-prototype-components/releases), so the components change only when you choose. Each has the package attached, as a plain download:

```sh
npm install https://github.com/alphagov/govuk-mobile-prototype-components/releases/download/v1.0.0/govuk-mobile-prototype-components.tgz
```

Use a release, not `main` or a commit on it: only a release has the [catalogue](#for-tools-that-build-prototypes). Installing one adds this package alone, with no dependencies, and runs nothing.

The package has the components, patterns and templates, the foundation, the frame, the definitions’ schemas, the catalogue, and the starter and command that make a new prototype. It leaves out the app’s screenshots and the components’ prose, which are only for these docs.

## 2. Write a screen

Each screen is a page. Load the script of each component it uses, then write the screen inside a `<govuk-app>`, in a `<govuk-prototype-frame>` to show it on an iPhone:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Passport reminders – my prototype</title>
  <script type="module" src="node_modules/govuk-mobile-prototype-components/src/frame/frame.js"></script>
  <script type="module" src="node_modules/govuk-mobile-prototype-components/src/components/screen/screen.js"></script>
  <script type="module" src="node_modules/govuk-mobile-prototype-components/src/components/nav-bar/nav-bar.js"></script>
  <script type="module" src="node_modules/govuk-mobile-prototype-components/src/components/text/text.js"></script>
  <script type="module" src="node_modules/govuk-mobile-prototype-components/src/components/button-stack/button-stack.js"></script>
  <script type="module" src="node_modules/govuk-mobile-prototype-components/src/components/button/button.js"></script>
</head>
<body>
  <govuk-prototype-frame>
    <govuk-app highlight-actions>
      <govuk-app-screen>
        <govuk-app-nav-bar title="Passport reminders"></govuk-app-nav-bar>
        <govuk-app-text>We’ll remind you 9 months before your passport runs out.</govuk-app-text>
        <govuk-app-button-stack slot="footer">
          <govuk-app-button name="turn-on" works>Turn on reminders</govuk-app-button>
        </govuk-app-button-stack>
      </govuk-app-screen>
    </govuk-app>
  </govuk-prototype-frame>
  <script>
    document.addEventListener('click', event => {
      if (event.target.closest('govuk-app button[name="turn-on"]')) location.href = 'reminders-on.html'
    })
  </script>
</body>
</html>
```

Each component’s script adds everything else it needs to the page: the app’s colours and type, the root’s styles, and the component’s own stylesheet. It loads them from beside itself, and nothing from another site, so a prototype works offline.

To find the components for a screen, see [Components](/components/). [Patterns](/patterns/) are whole screens, arranged as the app arranges them, to copy into a page and change the words of.

## 3. Serve it

Browsers won’t load scripts like these from a page opened from disk, so serve the folder from any web server, such as:

```sh
python3 -m http.server 8000
```

Then open the page at <http://localhost:8000/>, followed by its file’s name.

## 4. Make it do things

**Links go to other screens.** A component with an `href`, such as a grouped list row, is a real link: point it at another page of the prototype.

**Buttons send the browser’s own events.** Components draw real buttons and fields, so `click`, `input` and `change` bubble up as usual, carrying the `name` and `value` you gave them. Listen for them, and go somewhere or change the page:

```js
document.addEventListener('click', event => {
  const button = event.target.closest('govuk-app button')
  if (button) console.log(button.name, button.value)
})
```

What each component takes, its attributes and content, is on its [page](/components/), and in its definition file, `src/components/<name>/<name>.json`.

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

## The root, `<govuk-app>`

The app’s colours and type exist only inside `<govuk-app>`.

- `colour-scheme="light"` or `"dark"` fixes the scheme. Otherwise it follows the device.
- Its size and position are the page’s to set.
- `highlight-actions` shows what can be tapped when a tap goes nowhere. See [show what works](#show-what-works).

## The phone, `<govuk-prototype-frame>`

The frame fills the window, with the phone in the middle of it: an iPhone’s screen, with iOS’s status bar and home indicator over the app. It shrinks the phone to fit a window too small for it. The [examples](/examples/) are shown in it.

On a phone, or a window as narrow as one, there’s no phone drawn: the app fills the screen, with the phone’s own status bar over it. So the same page can be tried on a real phone.

- `bare` leaves the phone out in any window, as on a phone.
- `status-bar="light"` draws the status bar white, for a screen dark at its top, such as Home under its blue header. Over a sheet it’s white already, as iOS draws it.

Anything else in the frame, such as a link back to your prototype’s index, goes above the phone, and is hidden when the app fills the screen.

## Your page’s own styles

Prototype pages shouldn’t style anything inside `<govuk-app>`. If a page loads stylesheets of its own, such as GOV.UK Frontend, load them into a cascade layer, so none of their styles reach the components:

```html
<style>
  @import url("/assets/govuk-frontend.min.css") layer(page);
</style>
```

See [styles stay apart](/get-started/building-a-component/#styles-stay-apart) for why.

## For tools that build prototypes

Everything in the library, its templates, patterns and components with what each is for and when to use another, is in a catalogue generated from the definitions: a short [index](/catalogue/index.md) with a line for each, a card for each to read only when choosing between them, and [catalogue.json](/catalogue/catalogue.json) as data. It’s in every release, in `catalogue/`, but not on `main`.
