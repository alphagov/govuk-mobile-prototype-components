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

Prototype pages shouldn’t style anything inside `<govuk-app>`. See [styles stay apart](/get-started/building-a-component/#styles-stay-apart) for why.

## Inputs and outputs

**Attributes and content are the inputs.** What each component takes is on its [page](/components/), and in its definition file, `components/<name>/<name>.json`.

**The browser’s own events are the outputs.** Components draw real buttons and fields, so `click`, `input` and `change` bubble up as usual, carrying the `name` and `value` you gave them:

```js
document.addEventListener('click', event => {
  const button = event.target.closest('govuk-app button')
  if (button) console.log(button.name, button.value)
})
```

## Serve the page

Browsers won’t load modules from a page opened from disk, so serve the folder from any static server:

```sh
python3 -m http.server 8000
```

## Run this site locally

To work on the components or this site, you need Node.js 22.16 or later:

```sh
npm install
npm start
```

Then open <http://localhost:8080>. The site reloads when you change a component, its definition or a page.
