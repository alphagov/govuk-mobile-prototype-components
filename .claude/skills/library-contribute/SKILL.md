---
name: library-contribute
description: Adds to or changes the GOV.UK app prototype components library (this repository) - a new component, pattern or template, or a change to one - to the library's standard, from the request to a ready-for-review pull request. Works for developers and for designers who don't know git, CSS or JSON - it explains in plain words and does the technical work. Use it whenever someone here wants to add, build, make, contribute, propose or change something in the library ("add a divider component", "I've got a Figma design for a new card", "can we have a pattern for an error screen", "the warning banner needs a dark mode fix", "make a template for the Driving tab"), even if they don't say "contribute" or "PR".
---

# Contribute to the library

The library is web components that look and behave like the GOV.UK app's own, so a designer can prototype an app journey in HTML. Everything in it holds a standard, set in `AGENTS.md`: it matches the app, its definition says when to use it and when not, and it works in light and dark. This skill gets a contribution to that standard and into a pull request (a proposed change, for a developer to review and merge), whoever asks.

The person asking may be a developer, or a designer who has never used git. Work out which from how they write, and if in doubt, assume a designer. For a designer:

- Do all the technical work yourself. Ask only what they can answer: what it's for, where it is in the app, a link to the design, whether a screenshot looks right.
- Ask one question at a time, and say why you're asking.
- Explain each step in a few plain words before you take it, without jargon: "I'll save your changes and send them to GitHub for a developer to check" rather than "I'll commit and push".

[references/talking-to-designers.md](references/talking-to-designers.md) has the tone, the questions worth asking, and those not to ask. Read it before your first question to a designer.

Follow the steps in order. Each ends with something to show the person, so they can see it's going where they meant.

## 1. Understand the request

Find out, in plain words, one question at a time, until you know:

- **New or a change?** A change to something already in the library, or something it doesn't have.
- **Which kind of thing?**
  - A **component**: one piece of a screen, such as a button, a card or a divider. `src/components/<name>/`.
  - A **pattern**: one whole screen, as the app arranges it, to copy and change the words of, such as a confirmation. `src/patterns/<name>/`.
  - A **template**: a few real screens of the app that link to each other, to start a prototype from, such as Settings. `src/templates/<name>/`.

  Designers often say "component" for any of these. If they describe a whole screen, it's a pattern; a journey of screens, a template.
- **What it's for**: when a designer would use it, in a sentence.
- **Where it comes from**: is it in the app today (and where: which screen, iOS or Android), or a new design that isn't in the app yet? A new design is a **proposed** component: ask for the Figma link, or a screenshot.

Say back what you've understood in a sentence or two, and check it, before going on.

## 2. Check what exists first

Something in the library may already do it, and two components that do the same job make prototypes harder to build.

```sh
npm install            # if there's no node_modules
npm run catalogue
```

Read `catalogue/index.md`, then the cards (`catalogue/components/<name>.md`, and patterns' and templates') of anything that might fit, and the cards their "Avoid" entries point to.

- **Something fits already**: say so, with what to write to use it, and a link to its page on the docs site. Stop, unless the person still wants something new; then ask what the existing one doesn't do.
- **Something nearly fits**: propose changing it, such as a new `variant` or attribute, rather than a new component. Say what you'd change, and check.
- **Nothing fits**: go on.

For a change, read the whole folder of what's being changed now.

## 3. Find the source

Every component, pattern and template says where it comes from, so others can check it. [references/sources.md](references/sources.md) says where things live in the app repos, how to search them, how to pin a commit, and how to find and copy the app's own screenshots. Read it now.

- **In the app**: find it in the iOS and Android source (`gh search code`), read it, and note the commit you read it at. Find the screenshots from the app's snapshot tests, and copy them into `reference/` with `scripts/reference.js`. Read the source for every size, colour and font, rather than measuring screenshots.
- **Not in the app yet**: it's proposed. Take the design from the Figma link with the Figma tools, if you have them (load them with ToolSearch: `get_design_context` for sizes and colours, `get_screenshot` to see it), or from screenshots the person gives you. Copy a screenshot of the design into `reference/` if you have one as a file. Its definition gets `proposed`, saying where the design comes from, and `sources.figma` the link.

Record what you used honestly. If you couldn't find the source, or measured from a screenshot, say so in the definition and the `.md`: the next person will trust what it says.

Show the person what you found: "It's `DividerView` on iOS and `ListDivider` on Android. Here's the app's screenshot of it." For a designer, describe the screenshot, or show it.

## 4. Build it

Before writing anything, put the work on a branch of its own, named for the change, so nothing else is touched:

```sh
git fetch origin
git status                       # is anything uncommitted here?
```

If the working tree is clean and the person is happy to work here, `git switch -c <branch> origin/main`. If not, or you're unsure, use a worktree, a second copy of the repository beside this one: `git worktree add ../<repo>-<branch> -b <branch> origin/main`, then `npm install` in it, and work there. Name the branch for the change: `add-divider`, `fix-banner-dark-mode`. Tell a designer only: "I'll make a separate copy to work in, so nothing else changes."

Then follow the reference for the kind of thing it is. Each has a checklist and a skeleton to start from:

- A component: [references/component.md](references/component.md)
- A pattern: [references/pattern.md](references/pattern.md)
- A template: [references/template.md](references/template.md)

The rules are `AGENTS.md`'s, and `docs/get-started/building-a-component.md` says how a component works. Read both, and one or two existing components (or patterns, or templates) like the new one, before writing: matching their shape and voice is most of the standard. `button` and `status` are good to start from: one in the app, one proposed.

Three rules catch people out most:

- **Tokens only.** Colour, type and spacing come from `--app-*` tokens in `src/foundation/tokens.css`. If one is missing, add it there, with a comment naming where it comes from (a GovKit token, the Android app, the platform), and both light and dark values with `light-dark()`.
- **The 8pt grid.** Spacing is `--app-space-*`, or a `calc()` of them. A value off the grid only where the app has it, with a comment saying where.
- **`avoid`, both ways round.** Think which components someone might pick instead of this one, or this one instead of. Each needs an entry in this one's `avoid`, and the other's `avoid` may need one pointing here.

## 5. Check it

Run each of these, and fix what they find before going on.

1. **The build**: `npm run build`. It checks the definition against the schema, the catalogue's groups, the sidebar, `avoid`'s elements, and that the definition and script agree. Read a failure's message: it says what to change.
2. **The screenshots**: `npm run screenshots -- <name> --no-build`, straight after the build, or without `--no-build` on its own (the first time, `npx playwright install chromium`). Read each `screenshots-out/<name>/*-light.png` and `-dark.png` with the Read tool, beside the references in `reference/` or the Figma screenshot. Compare size, spacing, colour, type, corners and icons, in each state. Fix differences you can; list the ones you can't in the `.md` under "Known differences from the app". For a pattern or template, use `--url` with its page, as [references/pattern.md](references/pattern.md) and [references/template.md](references/template.md) say.
3. **Show the person.** Show a designer the screenshots, light and dark, beside the app's, and ask if it looks right. They know the design better than the measurements do.
4. **The review**: follow the `library-review` skill (`.claude/skills/library-review/SKILL.md`) on the change, as it says when another skill calls it. Fix every must-fix and should-fix, then run the review again, until it finds no must-fixes. If you disagree with a finding, say why to the person, rather than leave it. A lead about something that was there before your change, such as a component you added an `avoid` entry to having other gaps, isn't yours to fix: mention it in the pull request instead of widening the change.

## 6. Deliver it

Tell a designer what's about to happen first: "I'll save your work, send it to GitHub, and ask for a developer to review it. You'll get a link."

1. **Commit.** Stage only the files of this change (`git add <paths>`, never `-A` without checking `git status`). One commit for a small change; a few for a larger one, each a step that makes sense alone. Each message: a short imperative subject ("Add a divider component"), a blank line, then a body saying why: what it's for, where it comes from, anything left undone. End it with any attribution lines the session gives for commits.
2. **Push.** `git push -u origin <branch>`. If it's refused because the person can't write to the repository, `gh repo fork --remote --remote-name fork`, then `git push -u fork <branch>`. Never force-push.
3. **Open the pull request**, ready for review, not a draft: `gh pr create --base main --title "<subject>" --body-file <file>`. Write the body with [the template below](#the-pull-requests-body).
4. **Check CI.** `gh pr checks <number> --watch`. If it fails, read why (`gh run view --log-failed`), fix, commit and push again.
5. **Hand over.** Give the person the link, and one sentence on what happens next: "A developer on the team will review it, may ask for changes here or on GitHub, and then merge it, when it'll appear on the docs site." For a designer, add that they don't need to do anything else unless someone asks.

### The pull request's body

```markdown
<What it adds or changes, and why, in two or three sentences: what a designer can now do.>

## Where it comes from

- iOS: `<symbol>` in <repo> at `<commit>`
- Android: `<symbol>` in <repo> at `<commit>`
- <or> Proposed, from <Figma link or "a screenshot of the design">
- References: <the files in reference/, and which snapshot test each is from>

## What it looks like

<For each example, a sentence on what the screenshot shows in light and dark, and how it compares with the reference: "A 0.33pt line, the app's list divider colour, the same as the reference in light; dark uses the app's dark divider colour.">

## Known differences from the app

<From the .md, or "None that I could see.">

## Checklist

- [x] `npm run build` passes
- [x] Screenshots checked in light and dark against the references
- [x] `library-review`: no must-fixes <list any should-fixes or worth-a-looks left, and why>
- [x] Tokens only, on the 8pt grid
- [x] `avoid` checked both ways round
- [ ] Reviewed by a developer
```

End it with any attribution line the session gives for pull requests.

## If something goes wrong

- **No `gh`, or not signed in**: `gh auth status`. A designer may need a developer's help to sign in once (`gh auth login`); say so plainly, and stop at step 5 with the work saved on its branch.
- **The source can't be found**: say so, ask the person where in the app it is, and if it's not there, treat it as proposed.
- **No screenshots in the snapshot tests**: look for a screen that shows it, and crop that (see [references/sources.md](references/sources.md)). If there are none, say so in the `.md`, and compare with the source's numbers alone.
- **It can't match the app**, such as an effect the web can't draw: get close, and list it under "Known differences from the app".
