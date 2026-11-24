---
name: prototype-new
description: Makes a new prototype of the GOV.UK app on this computer, starting from the app's own Home, Settings and Chat screens or a blank screen, then opens it in the browser. Use it whenever someone wants to start, make, create or set up a new prototype, mock-up or journey of the GOV.UK app ("make a new prototype", "prototype the GOV.UK app", "I want to prototype a new setting", "start a prototype of the app's Chat", "new app prototype"), even if they don't say "new". Not for changing a prototype that already exists: if the folder already has one, open it with prototype-setup instead.
---

# Make a new prototype

The person is a designer, who may never have used a terminal, git or code. You do the technical work; they make the choices. Talk in plain, short UK English, one question at a time, and say what you're doing in a sentence as you go. Never mention git, commits, npm or Node.js unless something needs their say-so: "saving a version", "downloading the GOV.UK app components".

## 1. Ask what they need

One question at a time. Use the AskUserQuestion tool if you have it, with these choices.

1. **A name.** "What would you like to call your prototype? Something short that says what it's for, like 'Renew a passport' or 'New notification settings'."
2. **Where it starts.** "Where in the app would you like to start?"
   - **Home**, the app's home screen.
   - **Settings**, and the screens it opens, such as Face ID and signing out.
   - **Chat**, GOV.UK Chat, with a question and its answer.
   - **A blank screen**, in the app's frame, to build something new.

   Home, Settings and Chat come together whichever they choose, because the tab bar along the bottom of each opens the others. Their choice is the screen you open first.

If they've said either already, such as "prototype a new setting", don't ask it again.

## 2. Make the folder

- If the current folder is empty, apart from hidden files, make the prototype here.
- If it's a prototype already (it has `prototype.json`), ask if they want to open that one instead, with `prototype-setup`, or make a new one in a folder inside it.
- Otherwise make a folder for it here, named from the name in lowercase with hyphens, such as `renew-a-passport`. If that exists, add `-2`.

If the current folder is their home folder, suggest their Documents folder instead, and make it there if they agree.

Copy the starter files into it, hidden ones included:

```sh
cp -R "${CLAUDE_PLUGIN_ROOT}/starter/." <folder>/
```

Then put the name in: `name` in `prototype.json` as they wrote it, and `name` in `package.json` as the folder's name.

<!-- The starter's package.json installs the components from GitHub, at the
     latest commit on main. When the library is published to npm, change it
     to "govuk-mobile-prototype-components": "^<version>" there, so a
     prototype gets a release, not whatever's on main, and no longer needs
     git to install. -->

## 3. Install

Follow steps 2 and 3 of the `prototype-setup` skill, in the new folder: check git and Node.js, asking before installing either, then install the prototype's parts. Its instructions are in `${CLAUDE_PLUGIN_ROOT}/skills/prototype-setup/SKILL.md`; read them now if you haven't.

## 4. Add the screens

In the new folder, with the one they chose first:

```sh
node scripts/add-screens.js settings home chat    # Settings first
node scripts/add-screens.js blank                 # a blank screen
```

It copies each template's screens from the components into `screens/<template>/`, ready to run here, and lists them on the start page. If it says a template isn't there, tell them that part of the app isn't available yet, and offer the others.

## 5. Save the first version

Quietly, without telling them about git:

```sh
git init -q
git config user.name >/dev/null || git config user.name "Prototype"
git config user.email >/dev/null || git config user.email "prototype@localhost"
git add -A && git commit -q -m "Start the prototype"
```

The two config lines only fill in a name for the versions if their computer hasn't got one, and only in this folder.

## 6. Open it

Follow steps 4 and 5 of `prototype-setup`: start it, then open the first screen of what they chose, such as `http://localhost:3000/screens/settings/index.html`, or `screens/start/index.html` for a blank screen.

## 7. Say what's next

Tell them, briefly, what you've made, where it is on their computer (the folder's full path), and what they can ask for. For example:

> Your prototype "Renew a passport" is open in your browser, starting at Settings. It has the app's Home, Settings and Chat screens, which link to each other as they do in the app. Its start page, http://localhost:3000, lists every screen.
>
> You can ask me things like:
> - "Add a new setting called Passport reminders, that opens a screen explaining it"
> - "Change the words on the Face ID screen"
> - "Make a screen that asks for your passport number, and show it on the next screen"
> - "Undo that"
>
> Next time, open Claude in this folder and say "open my prototype".

From here on, follow the prototype's own `CLAUDE.md` for how to make screens.
