---
name: prototype-update-library
description: Updates this GOV.UK app prototype to the latest release of the GOV.UK app components - says in plain words whether there's anything newer and what it changes, asks first, saves a version, switches to it, brings Claude's skills and the prototype's starter files up to date without touching anything the designer has changed, then checks every screen still looks right and offers to go back. Use it whenever someone says "get the latest components", "update my prototype", "is there a new version?", "update the library", "I heard there's a new component", or wants something the library has added since the prototype was made, even if they don't say "update".
---

# Update the prototype to the latest components

The person is a designer. They want the newest parts of the app in their prototype, without losing anything they've made. Everything between here and there is yours to do. Say what's happening in a sentence or two as you go, in plain words: "the latest version of the app's parts", "Claude's instructions", "save a version", never "release", "package", "npm", "tag", "commit" or "dependency". Ask one question at a time. Never paste an error: say what went wrong, and what you're doing about it.

Run everything in the prototype's folder. If the prototype isn't running and they want to see it afterwards, the `prototype-setup` skill starts it.

## 1. Is there anything newer?

If this prototype's `scripts/use-latest-components.js` doesn't mention `--check`, it was made before this skill, and that script would update straight away: see [A prototype made before this skill](#a-prototype-made-before-this-skill) instead. Otherwise:

```sh
node scripts/use-latest-components.js --check
```

It changes nothing. It prints, as JSON, the version the prototype uses (`using`), the `latest`, whether that's `newer`, and the notes of each release in between (`releases`). If it fails, its message is already plain: pass it on, in your own words.

If nothing's newer, say so ("Your prototype already has the latest version of the app's parts, from <date>."), and stop.

## 2. Say what's changed, and ask

Read the notes of every release in between. They list the changes as developers named them, such as "Add a status component" or "Fix the toggle's colour in dark mode". Turn them into what a designer would notice, in three to five short bullets at most:

- **New things they can use**: a component, a pattern of a whole screen, a part of the app to start from. Say what each is for, not its name in code: "a coloured label, for showing whether something's due or done".
- **Things that look or work differently**: anything that could change how their screens look, such as a fixed colour or spacing. These matter most, as they'll see them.
- **Better help from Claude**: new or better instructions for building screens, if there are any. One bullet, at most.

Leave out what only matters to people working on the library itself: its website, its checks, how it's released, the survey of the app. If a title doesn't say enough to know what it means for them, and it might matter, read that pull request's description (`gh pr view <number> --repo alphagov/govuk-mobile-prototype-components` if `gh` is there; otherwise skip it). Don't read more than a few.

If `components/` has something custom that the latest version now has in the library, such as a status label made for this prototype when the library has added one, say so: they may want to switch to the library's afterwards.

Then ask, in about these words: "Shall I update your prototype? I'll save a version first, so we can go back if anything looks wrong."

Wait for a yes.

## 3. Save a version, and remember how it was

If this folder has a version history (a `.git` folder: check for it, don't run git to find out, as on a Mac without Apple's developer tools that asks to install them), save a version first:

```sh
git add -A && git commit -q -m "Before updating the components"
```

It says "nothing to commit" if everything's saved already: that's fine. Note the version you're on (`git rev-parse --short HEAD`), to go back to.

Then keep a copy of what the prototype has now, outside it, to compare against. `node library.js` prints where the installed library is: `<library>` below is its `libraryFiles`.

```sh
before=$(mktemp -d) && cp -R "<library>/starter" "$before/starter" && cp package.json "$before/" && echo "$before"
```

Note that folder; below it's `<before>`. The copy of the starter is how step 5 tells which of the prototype's files someone has changed. If the library isn't installed, so there's nothing to copy, download the version `package.json` names instead: `curl -fsSL "<its address>" | tar -xz -C "<before>" && mv "<before>/package/src/starter" "<before>/starter"`.

If `scripts/screenshots.js` is there, take pictures of every screen as it is now, to compare with afterwards, and move them into `<before>` so the next ones don't replace them:

```sh
rm -rf .screenshots && node scripts/screenshots.js --all && mv .screenshots "<before>/screenshots"
```

If it says `NO_BROWSER`, offer to download one, as the `prototype-build` skill does. If they'd rather not, or there's no `scripts/screenshots.js`, carry on without: you'll ask them to look instead, in step 6.

## 4. Switch to the latest

Say: "I'm downloading the latest version of the app's parts. It takes a few seconds."

```sh
node scripts/use-latest-components.js && npm install --no-audit --no-fund
```

If the download fails, it's usually the network: say so, and put `package.json` back from `<before>`, so nothing's half done.

## 5. Bring the starter files and Claude's skills up to date

The prototype was made with a copy of the starter: the start page, the server, `CLAUDE.md`, the scripts, and Claude's skills in `.claude/skills/`. The new version may have better ones. Run the new version's own script for this, from the library just installed, not the prototype's copy, so it's always the newest:

```sh
node "<library>/starter/scripts/refresh-starter.js" --old "<before>/starter"
```

(`<library>` is where it was before. Run `node library.js` again if unsure.)

The rule it follows is simple, and safe: a file is replaced only if it's exactly as the old version had it, so no one has changed it. A file someone has changed is kept as it is. A new file is added, and one the new version hasn't got any more is removed if no one changed it. It never touches `prototype.json`, the screens in `screens/`, or anything custom in `components/`. It prints what it did: `updated`, `added`, `removed`, `kept` and `leftOut` (a file someone took out, which it leaves out).

For each file in `kept`, compare its `oldRelease` and `newRelease` copies (`diff`). If the new version changed something there, bring that change into the prototype's copy by hand, keeping everything they or you added: this matters most for `CLAUDE.md` and the skills, which tell you how to work on the prototype. If the change and theirs overlap so you can't tell what's right, keep theirs and say so in step 7. A kept file whose `newRelease` is empty has gone from the library: leave it.

If any of the skills changed, Claude Code may only pick them up when it next starts in this folder: read any you need now from `.claude/skills/`.

If the prototype is running, and `server.js` was updated, restart it (stop the background task, and `npm start` again in the background), so it runs the new one.

## 6. Check every screen

If `scripts/screenshots.js` is there now, take pictures of every screen again:

```sh
node scripts/screenshots.js --all
```

Fix every `Problem:` line it prints. Then compare the pictures with those from before:

```sh
node .claude/skills/prototype-update-library/scripts/compare-screenshots.js "<before>/screenshots" .screenshots
```

It says, for each picture, whether it's the `same`, or `changed`, and where. Text is drawn a little differently each time, so it ignores a few pixels. Read both of each changed pair with the Read tool, and work out what's different, and whether it's the new version doing what its notes said (rounder corners, a fixed colour) or something broken (a screen that's lost a part, or shows plain text where a component should be). A `new` picture, with no old one: read it, and check it looks right.

If there are no pictures, give them the link to the start page and ask them to look through their screens, in light and dark (their Mac's appearance setting), and tell you if anything looks wrong.

## 7. Save it, and tell them

Save a version, if there's a history: `git add -A && git commit -q -m "Update the components to <latest>"`.

Then tell them, in a few short lines:

- That it's updated, and the date of the version it's on now.
- What they'll notice, from step 2, and what changed on their screens, from step 6, if anything did.
- That Claude's instructions are up to date, and anything of theirs you kept as it was, in a sentence: "I kept your changes to my instructions, and added the new parts."
- Their link, to have a look.

Offer to go back if anything looks wrong.

## Going back

If they want to go back to how it was:

- **With a history**: `git revert --no-edit <the version you noted>..HEAD`, then `npm install --no-audit --no-fund`. That undoes the update and keeps it in the history, in case they change their mind again.
- **Without one**: copy `package.json` back from `<before>`, put back the `updated` and `removed` files from `<before>/starter/` (a skill's from `starter/skills/` to `.claude/skills/`, `starter/gitignore` to `.gitignore`, the rest to the same place), delete the `added` ones, undo anything you carried into a `kept` file, then `npm install --no-audit --no-fund`.

Restart the prototype if it's running, check a screen loads, and tell them it's back as it was.

## A prototype made before this skill

You may be following this skill from the library's copy, for a prototype whose own scripts are older: `.claude/skills/` has no `prototype-update-library`, or `scripts/use-latest-components.js` doesn't mention `--check`. Don't run that script to check: it would update straight away. Instead, use the latest version's scripts:

1. Make `<before>` (`mktemp -d`), and download the latest version into it: `curl -fsSL "https://github.com/alphagov/govuk-mobile-prototype-components/releases/latest/download/govuk-mobile-prototype-components.tgz" | tar -xz -C "<before>"`.
2. In the prototype's folder, `node "<before>/package/src/starter/scripts/use-latest-components.js" --check` does step 1, for this prototype. Then steps 2 and 3 as usual.
3. If the components have been updated already, the old way, without the starter files (`node_modules` has the latest, but the skills are old): the copy of the starter from before isn't installed any more. Find the address of the version they had before in `package.json`'s history (`git log -p -- package.json`), download it as in step 3, and go on from step 5.

From step 4 on, everything is as above, and step 5 brings this skill into the prototype, so next time it's there.
