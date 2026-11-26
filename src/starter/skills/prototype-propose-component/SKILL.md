---
name: prototype-propose-component
description: Offers a component made for this GOV.UK app prototype, in its components/ folder, to the GOV.UK app components library, so every prototype can use it - explains what happens, checks it's ready in plain words, gets a copy of the library, builds it in the library's way (marked as proposed unless it's in the app already) and sends it to GitHub for a developer to review, giving the designer the link; or, without GitHub, writes it up as a file to send to the library's team. Use it whenever someone says "add this to the library", "share my component", "can other people use this?", "propose this component", "send this to the team", or wants something custom they've made here to be part of the library, even if they don't say "component".
---

# Offer a component to the library

The person is a designer. Something made for their prototype, in `components/<name>/`, could be useful to everyone, and they'd like it in the library. Everything between here and there is yours to do. They decide what it's for and whether it looks right; you do the rest.

Talk in plain, short UK English, one question at a time. Say "the library", "a copy of the library", "send it to GitHub", "a developer checks it": never "clone", "branch", "commit", "push" or "PR" without saying what it means. Never paste errors or code at them.

## 1. Which component, and what happens

List the folders in `components/`. Each has a `<name>.json` whose `name` is what a designer calls it. None: say that only things made for this prototype can be offered, as everything else is from the library already, and stop. Several, and they haven't said which: ask, by those names.

Then say what happens, in about these words, and check they want to go on:

> I'll get a copy of the library, add your <name> to it the way the library's own parts are made, and check it. Then I'll send it to GitHub as a suggestion. A developer on the team will look at it, may ask for changes, and once they're happy it'll be in the library for every prototype. It takes me a while, but you only need to answer a few questions. Your prototype keeps its own copy, so nothing changes for you.

## 2. Where it comes from

The library says where each part comes from, so ask, one at a time, offering a likely answer:

- **Is it in the app today**, or a new design? Most things made in a prototype are new. If it's in the app, ask where: which screen, iOS or Android.
- **Is there a design for it**: a Figma link, or a screenshot? If it was only made here, that's fine: say it'll be marked as made in a prototype.

Something not in the app yet goes into the library as **proposed**: its page says it's from future designs, not the app. That's normal for a new idea.

## 3. Check it's ready

Read its files, and a library component like it. `node library.js` prints where the library is: `<library>` below is its `libraryFiles`, and `<catalogue>` its `catalogue`. Look in `<library>/components/`, such as `status/`. The library holds every part to a standard, and the developer reviewing it will check the same things. Look for:

- **Is it something the library hasn't got?** Read `<catalogue>/index.md` and the cards of anything close. If the library has something that does the job, say so, and offer to use that in their prototype instead. If the library has something nearly right, it may be better as a change to that: say so, and that you'll suggest it that way.
- **Is it general?** Words and choices that are only for this prototype, such as a registration number written into it, should be things a screen gives it, so others can use it for their own.
- **Does it follow the library's rules?** Its own `govuk-app-<name>` classes only; colours, type and spacing from the `--app-*` tokens, with spacing on the 8pt grid; icons from the library's icon font, never Apple's; real links and buttons for anything pressable, and no events of its own; nothing loaded from other sites; and a `<name>.json` saying what it's for. These are the rules `CLAUDE.md` gives for something custom, and the `prototype-build` skill's `references/custom-component.md` if this prototype has it. The library's full rules are in its `AGENTS.md`, which you'll read in step 6.
- **Does it look right**, in light and dark? If `scripts/screenshots.js` is there, take pictures of a screen that uses it (`node scripts/screenshots.js /screens/<folder>/<page>.html`) and read them. If not, ask them to look at it, in light and dark (their Mac's appearance setting).

Tell them what you found in a few plain lines: what's ready, and what you'll change and why, such as "Its corners are a fixed size, so I'll use the app's own" or "It shows white on white in dark mode, so I'll fix that". If you'd change how it looks, ask first. Make those fixes in their prototype too, with their yes, so their copy and the library's match.

## 4. Can I send it to GitHub?

Sending it needs git, and GitHub's own tool, `gh`, signed in to a GitHub account. Check quietly:

- Git: on a Mac, if `xcode-select -p` fails and `which git` says `/usr/bin/git`, there's no git (running it would ask to install Apple's developer tools). Otherwise `git --version`.
- `gh --version`, then `gh auth status`.

If all three are there, go on to step 5.

If not, explain in a sentence or two what's missing, and give them the choice:

> To send it to the library myself, I need a free tool from GitHub on your computer, signed in to a GitHub account. You haven't got that set up yet. I can either:
>
> 1. Help you set it up now. It takes about ten minutes, and you'll need a GitHub account. A developer on your team can help if you'd rather.
> 2. Write it up as a file you can send to the library's team, by email or Slack, and they'll take it from there.

For 1: ask before installing anything. Without git, on a Mac, that's Apple's developer tools (`xcode-select --install`, which opens a window for them to click Install). Then `gh`: with Homebrew, `brew install gh`; without, the Mac download from <https://cli.github.com>. Then `gh auth login --web`, which shows a code to type in the browser. Once `gh auth status` is happy, go on to step 5.

For 2: follow [references/write-up.md](references/write-up.md), and stop there.

## 5. Get a copy of the library

Put it next to the prototype, in a folder called `govuk-mobile-prototype-components`, so it's easy to find if something stops halfway. If that folder's there already from last time, use it: check it's a copy of the library (`git remote get-url origin` names `alphagov/govuk-mobile-prototype-components`) and has nothing left unsaved (`git status`), then `git fetch origin`. If something else is there, or you're unsure, ask where to put it, or use a temporary folder (`mktemp -d`).

Say: "I'm getting a copy of the library. It takes a minute." Then:

```sh
gh repo clone alphagov/govuk-mobile-prototype-components "<folder>"
cd "<folder>" && npm install --no-audit --no-fund
```

`npm install` there downloads the tools the library uses to check its work. It needs nothing installed on their computer beyond what the prototype has.

## 6. Build it in the library

Read the copy's `AGENTS.md`, then its `.claude/skills/library-contribute/SKILL.md`, and follow it, from the copy's folder. It's the library's own way of adding a component, and it may have changed since this prototype was made, so follow it as it is, not as you remember it. What you know already answers most of its first step:

- It's a **component**, new to the library (or a change to one, if step 3 found something nearly right).
- What it's for: from its `.json`'s `purpose`, and what the designer said.
- Where it comes from: from step 2. Not in the app: it's **proposed**, with `proposed.design` saying where its design is from: their Figma link, their screenshot, or "made in a prototype, <prototype's name>, in the library's style". In the app: find its source, as that skill says, and leave out `proposed`.

Don't ask again what you know. Take the prototype's files as the start, and bring them up to the library's standard as that skill's component reference says. The usual differences:

- Its script imports `defineComponent` from `../../foundation/component.js`, not `/library/src/foundation/component.js`.
- Its definition needs everything the library's schema asks for, which the prototype's short one hasn't got: `$schema`, `origin`, `inputs.contains`, `outputs`, `avoid` (both ways round), `sources` and `references`, and examples of each of its states.
- A `.md` with "Where it comes from" and "Known differences from the designs".
- A screenshot of its design in `reference/`, if there's one as a file.
- Its place in one of the catalogue's groups, in `scripts/catalogue.js`.

That skill asks to show the designer screenshots, light and dark, and reviews the work with the `library-review` skill: do both. Fix every must-fix before going on.

When it gets to sending it to GitHub, tell them first: "I'll send it to GitHub now, and ask for a developer to check it." If their account can't add to the library directly, that skill makes a copy of the library in their account and sends it from there: that's normal.

## 7. Hand over

Give them the link, and say what happens next, in about these words:

> Here it is: <link>. A developer on the library's team will look at it. They may ask questions or for changes there, and GitHub will email you if they do. You don't need to do anything else unless someone asks. Once it's in, the next time you say "update my prototype", I can switch your prototype to the library's version.

The copy of the library stays in `<folder>`, in case it needs changes. Tell them where, in a sentence, so they're not surprised by it.
