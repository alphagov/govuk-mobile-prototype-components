# Write it up to send

For when the component can't be sent to GitHub from here. The write-up is one file the designer can send to the library's team, by email or Slack, with everything a developer needs to add it to the library without asking: what it's for, where its design comes from, what it looks like, and its files.

## Make it

Put it in the prototype's folder, as `<name>-for-the-library.md`, from this outline. Fill in every `<…>`. Keep the words plain: the designer may read it before sending it.

````markdown
# <What a designer calls it>, for the GOV.UK app components library

<What it's for, in two or three sentences: when a designer would use it, and why nothing in the library does the job.>

Made in a prototype, <the prototype's name>, by <the designer, if they'd like to be named>, on <date>, with version <the version in package.json's address, such as v0.6.0> of the library.

## Where it comes from

<In the app today, and where (screen, iOS or Android), or a new design: the Figma link, "a screenshot, attached", or "made in the prototype, in the library's style, with no separate design".>

## What it looks like

<Say which pictures are attached, light and dark, and what each shows.>

## Checked

<What step 3 found and fixed, in a line or two, and anything not yet like the library's: "Its spacing is on the 8pt grid and it uses only the app's colours. It has no avoid entries yet.">

## Its files

They go in `src/components/<name>/` in the library. The script's import needs changing from `/library/src/foundation/component.js` to `../../foundation/component.js`.

### <name>.html

```html
<the file, as it is>
```

### <name>.css

```css
<the file>
```

### <name>.js

```js
<the file>
```

### <name>.json

```json
<the file>
```
````

Put in every file in `components/<name>/` as it is, after any fixes from step 3. If it has pictures or fonts of its own, list them under "Its files" and say they're attached.

## Pictures

If `scripts/screenshots.js` is there, take pictures of a screen that shows it, light and dark, and copy them next to the write-up, named `<name>-light.png` and `<name>-dark.png`. If not, ask the designer to take a screenshot of it in each (on a Mac, Shift, Command and 4, then drag around it).

## Send it

Tell them where the file and pictures are, and what to do with them, in about these words:

> I've written it up in <name>-for-the-library.md, in your prototype's folder, with two pictures beside it. Send them to the library's team, on Slack or by email, and a developer will add it. They'll know what to do with it.

If they don't know who to send it to, suggest they ask whoever set up their prototype, or the GOV.UK app team. Don't make up a name, channel or address.
