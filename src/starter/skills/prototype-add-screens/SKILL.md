---
name: prototype-add-screens
description: Adds screens to this GOV.UK app prototype, either a whole part of the app from the library's templates (such as Settings, Home or Chat, with every screen it opens) or a new blank screen, and lists them on the start page. Use it whenever someone wants to add, start from or bring in a part of the app or a new screen ("add the Settings screens", "I need the Chat tab too", "start a new screen for passport reminders", "add a blank screen", "copy the app's Home screen in"), even if they don't say "template".
---

# Add screens to the prototype

The person is a designer. Talk in plain words: "screens" and "parts of the app", not files or templates.

## Which screens

Read `<catalogue>/index.md` (`node library.js` prints where `<catalogue>` is) for the templates there are, and their cards for what each holds. If they've asked for a part of the app the library has, add its template. If not, or they want something new, add a blank screen and build on it, following `CLAUDE.md`.

Home, Settings and Chat come together, because the tab bar on each opens the others. If any of them is missing from `screens/`, add all three.

## Add them

```sh
node scripts/add-screens.js settings home chat    # a part of the app, by its template's folder name
node scripts/add-screens.js blank                 # a blank screen, in screens/start/
```

It copies each template's screens into `screens/<template>/`, points them at the library, adds `prototype.js` to each, and lists them in `prototype.json`, so they show on the start page. It never overwrites screens that are there already: if it says so, the part's there; carry on with what is.

For another blank screen, when `screens/start/` exists, copy `screens/start/index.html` to a new file, change its title and heading, and add it to `prototype.json`'s `screens` with its `title` and `path`.

## Then

Save a version, if this folder has a version history (a `.git` folder): `git add -A && git commit -q -m "Add <what, in plain words>"`. Don't mention it.

Give them the address of the first new screen, such as `http://localhost:3000/screens/settings/index.html`, and say in a sentence what's there and what they could ask for next. If the prototype isn't running, use the `prototype-setup` skill first.
