---
name: prototype-build
description: Makes and changes the screens and journeys of this GOV.UK app prototype - a new journey of several screens, one new screen, or a change to one that's here - from the designer's words, a Figma link, a screenshot or a sketch, choosing from the library's templates, patterns and components, wiring buttons and links, remembering answers between screens, and checking every screen in light and dark. Use it whenever someone wants to add, make, design, mock up, change or link up anything in the prototype ("make a journey to add a vehicle", "add a Vehicles row to Settings", "make this screen" with an image, "here's the Figma for the new flow", "change the wording on Face ID", "make the button go to the next screen", "show the postcode they typed on the check screen"), even if they don't say "screen" or "journey".
---

# Build screens and journeys

The person is a designer, who may never have written code. They know what the app should do; you know how the prototype is made. So:

- Talk in plain, short UK English: "screen", "button", "the check screen", never "HTML", "component", "attribute" or "script".
- Ask one question at a time, and only what they can answer: what the user is doing, where it starts, what happens next. Offer a likely answer, so they can just say yes. Work out the rest yourself.
- Do all the technical work. Never paste code or errors at them.

`node library.js` says where the installed library is. Below, `<catalogue>` is its `catalogue`, and `<library>` its `libraryFiles`. If the prototype isn't running, use the `prototype-setup` skill first. To bring in a whole part of the app, such as Settings or Home, use `prototype-add-screens`, then come back here to change it.

## 1. Understand what they want

Work out three things, from what they've said and what's in `screens/` already, asking only what you can't tell:

- **Where it starts.** A change to a screen that's here (read it first); more screens from a part of the app the library has (`prototype-add-screens`, then change them); or new screens, in the app's frame. A new journey usually starts from a row or button on a screen that's here, such as a row on Settings.
- **What they've given you.** Words; a Figma link; a screenshot, photo or sketch; or "like this screen, but...". For a design or an image, read [references/from-designs.md](references/from-designs.md) now.
- **What happens.** What the user sees, what they choose or type, where each button goes, and how it ends. Note any answer that's used on a later screen, or that changes where the journey goes.

For a single small change, such as new wording, a row, or where a button goes, skip the plan: make it, check it (step 6), and tell them.

## 2. Plan, and agree it

Before building more than one screen, show the plan in plain words, and wait for a yes. A plan is cheap to change; built screens aren't. Read the catalogue first (step 3), so the plan can say what each screen is made from. Keep it short, like this:

> **Add a vehicle**, 5 screens, starting from Settings
>
> 1. **Settings**: a new row, Vehicles, opens 2.
> 2. **Your vehicles**: the vehicles they've saved, and Add vehicle, which opens 3. Laid out like Settings.
> 3. **What's the registration number?**: one question, with Continue to 4.
> 4. **Check your vehicle**: the registration from 3, on a number plate, with Confirm to 5 and Change back to 3.
> 5. **Vehicle added**: a short "done" screen, with Done back to 2.
>
> Remembered: the registration, asked on 3, shown on 4 and 2.
> Screens 2 and 5 are laid out as the app's own; 3 and 4 aren't screens the app has, so I'll put them together from its parts. The vehicle cards on 2 are from future designs, not the app today.

Say which screens are the app's own (a template or pattern), which are put together from its parts, and anything you'd have to make that isn't one of the app's (step 5). If a part is proposed (not in the app yet), say so here.

## 3. Choose from the catalogue

Read `<catalogue>/index.md` first, then only the cards of your candidates, and the cards their "Avoid" entries point to. Choose in this order: a template, a pattern, components, and something custom only when nothing fits. Follow each card's rules. [references/choosing-components.md](references/choosing-components.md) has the common choices, the look-alikes people mix up, and how to read a card.

## 4. Build

Each screen is a page of its own in `screens/`, in a folder for the journey: `screens/vehicles/index.html`, `screens/vehicles/registration.html`. Start each page from the closest thing there is, in this order: a screen already in `screens/` like it, the pattern's HTML in `<library>/patterns/<name>/<name>.html`, or the skeleton below. Copy the comment at the top of a template page if you start from one, and keep it true.

```html
<!doctype html>
<!--
  <What this screen is, and where it's opened from.>
-->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title><Screen title> – GOV.UK app prototype</title>
  <script type="module" src="/library/src/frame/frame.js"></script>
  <script type="module" src="/prototype.js"></script>
  <script type="module" src="/library/src/components/screen/screen.js"></script>
  <script type="module" src="/library/src/components/nav-bar/nav-bar.js"></script>
  <!-- One script for each other component the screen uses -->
</head>
<body>
  <govuk-prototype-frame>
    <govuk-app highlight-actions>
      <govuk-app-screen>
        <govuk-app-nav-bar title="<Title>" back-href="<the screen before>"></govuk-app-nav-bar>
        <!-- The screen's components, top to bottom -->
      </govuk-app-screen>
    </govuk-app>
  </govuk-prototype-frame>
</body>
</html>
```

- **Scripts.** A card's `Load:` path is from the library's root, so put `/library/` in front: `src/components/button/button.js` is `/library/src/components/button/button.js`. Every component on the page needs its script, or it shows as plain text. A part, such as `govuk-app-grouped-list-row`, comes with its component's script.
- **Where buttons go.** Links go with `href` where a component takes one. A button goes nowhere until the page listens for it by name: [references/journeys-and-wiring.md](references/journeys-and-wiring.md) has the small script for that, and how back buttons, sheets and tab bars work across pages.
- **Remembered answers**, and journeys that branch on them: [references/answers-and-branching.md](references/answers-and-branching.md).
- **The start page.** Add each new screen to `prototype.json`'s `screens`, with its `title`, `path`, a `description` of a few words, and a `group` named for the journey, in the order the journey goes.
- **Linking it in.** A new journey needs a way in: change the screen it starts from, such as a new row on Settings with an `href` to the first new screen.
- **No styles of your own** inside `<govuk-app>`: no `<style>`, no `style=""`, no classes on components. If the library can't draw what's needed, that's step 5.
- **Words.** Write as GOV.UK does: short, plain, sentence case, the user's words. Use real-looking examples (a registration like AB12 CDE), not "Lorem ipsum" or "Button".

## 5. Something custom, only when nothing fits

When no template, pattern or arrangement of components can show what's needed, make a component of the prototype's own, in `components/<name>/`, the library's way, so it looks like the app in light and dark. [references/custom-component.md](references/custom-component.md) has the skeleton files and the rules. Tell the designer, in a sentence, that it isn't one of the app's own and why you made it.

Never change the installed library, in `node_modules/`. If they'd like something you made added to the library for everyone, use the `prototype-propose-component` skill.

## 6. Check your work

Look at every screen you made or changed, in light and dark, before showing anyone.

```sh
npm run screenshots -- /screens/vehicles/index.html /screens/vehicles/registration.html
```

It draws each on the phone in `.screenshots/` (`vehicles-index-light.png` and `-dark.png`), and lists any `Problem:` it finds, such as a missing script or a link to a page that isn't there. `--answers '{"registration":"AB12 CDE"}'` draws a screen as if those answers were given, to see a remembered answer shown (over the same files, so look before drawing it again without). A screen longer than the phone gets a second picture, `-end.png`, scrolled to the bottom. `--all` draws every screen in `prototype.json`. If this prototype has no `scripts/screenshots.js`, it was made before there was one: skip to "If there's no browser", below.

**The first time**, it may say `NO_BROWSER`: there's no Chrome, Edge or Brave on the computer to draw with. Ask, in about these words: "To check the screens look right, I take pictures of them with a browser that runs out of sight. Your computer hasn't got one I can use. Can I download one from Google? It's about 100MB, goes in your own folder, and every prototype will use it." With a yes, run `npm run screenshots -- --install-browser`, then the screenshots again.

**If there's no browser**, because they said no or it won't install, ask them to look instead: give them the screen's link, and ask what they see, in light and in dark (their Mac's appearance setting).

Read every PNG with the Read tool, and check:

- Each `Problem:` line. Fix every one.
- Everything is drawn: no plain text where a component should be, no icon shown as its name, nothing cut off or overlapping.
- It matches the plan, and the design if there is one: the same title, rows, buttons and words, in the same order.
- It looks like the template or pattern it came from: a back button on every screen pushed on top of another, a tab bar only on the app's top-level screens, at most one primary button, the button stack at the bottom.
- Dark looks deliberate: everything readable, nothing that only works on white.
- Remembered answers show where they should (screenshot with `--answers`).

Fix what's wrong, and screenshot again, until it's right. You needn't show them the screenshots; they'll see the real thing.

## 7. Hand it over

Give them the link to the first screen of what you made, such as `http://localhost:3000/screens/vehicles/index.html` (the port `npm start` printed), and two lines on what's there and anything that isn't one of the app's own. Offer what they might do next, such as "try it, and tell me what to change", "add an error for a blank registration", or "make the other way through".

If the folder has a `.git` folder (check for it, don't run git to find out), save a version quietly: `git add -A && git commit -q -m "<what changed, in plain words>"`. Don't mention it.
