---
name: library-review
description: Reviews a change to the GOV.UK app prototype components library (this repository) against its own rules in AGENTS.md - components, their templates, styles and scripts, definitions (.json), patterns, tokens and the docs site - then reports what must, should and might be fixed, in words a designer can follow. Use it whenever someone asks to review, check or look over a PR, branch or their changes here ("review PR #80", "review my changes", "is this ready?", "check my new component"), and before opening a PR that adds to or changes the library, even if they don't say "review".
---

# Review a change to the library

The library is web components that look and behave like the GOV.UK app's, for prototyping app journeys in HTML. It holds a high standard so a prototype looks like the app, and so a designer, or a tool, can trust each component's definition to choose between them. This review is the gate that keeps that standard, for developers and for designers who've never written CSS. So it has to be right (no false alarms that waste someone's afternoon) and it has to be readable by someone non-technical.

The rules are the repository's own, in `AGENTS.md`. [references/checklist.md](references/checklist.md) groups them for review and says where each comes from. Don't add rules of your own: if something looks wrong but no rule covers it, it can go under "Worth a look", saying it's your judgement.

## 1. Work out what changed

Find the change, and the components, patterns and docs it touches.

- **A PR** ("review PR #80"): `gh pr view 80` for its title, body and branch, and `gh pr diff 80` for the diff. To build and screenshot it you need its files: if the working tree is clean, `gh pr checkout 80`; if not, don't disturb it, use `git worktree add ../review-pr-80 $(gh pr view 80 --json headRefName -q .headRefName)` after `git fetch origin`, and work there. Say which you did.
- **A branch, or "my changes"**: `git fetch origin`, then `git diff origin/main...HEAD` for what's committed and `git status` for what isn't, including new files. Review both.
- **A named component** with no change ("review the status component"): its whole folder, as it stands.

List the changed components (folders under `src/components/`), patterns (`src/patterns/`), and anything in `src/foundation/` or `docs/`. Read every changed file in full, not only the diff: a rule like "a comment says why" needs the lines around it. For a new component, read one or two existing components of the same kind too, such as `button` or `grouped-list`, to compare its voice and shape.

## 2. Run the checks a machine can do

Run these from the repository's root. If `node_modules` is missing, `npm install` first.

**The build.** `npm run build`. It fails on a definition that doesn't match the schema, a component missing from the sidebar, an `avoid` that names an element, attribute or value the library hasn't, a definition that disagrees with its script about attributes, and a pattern whose `components` don't match its HTML. A failure is always a must-fix: quote its message, and explain it.

**The rule checker.** `node .claude/skills/library-review/scripts/check.js --base origin/main` checks only the lines the change touches, committed or not. Name components after it (`... check.js status button`) to check every line of them instead. It looks for raw colours, spacing off the 8pt grid without a comment, selectors on other components' classes or bare elements, `@layer`, `display: contents` on the component's element, unknown tokens, icons without `govuk-app-icon`, events of a component's own, sources without a commit, and docs styles on GOV.UK Frontend's classes.

Its findings are leads, not verdicts. Open each at its line and decide: a value off the grid may be explained by a comment a few lines up; a raw `font-size` may be an icon's glyph size, which isn't type. Drop the ones that are fine. Keep its severity unless reading the code tells you otherwise. When you checked whole components rather than a change, say which findings were already on `main` before this change, and keep them apart from the change's own.

**Screenshots.** `npm run screenshots -- <component> <component>` for each changed component. It builds the site, draws each example in light and dark, and puts them in `screenshots-out/<component>/<example>-light.png` and `-dark.png`. The first time, it may ask for `npx playwright install chromium`; run that and try again.

Then look at them. Use the Read tool on each light and dark PNG, and on the component's references beside them:

- In the app: its `reference/` images, listed in the definition's `references`.
- Proposed: wherever `proposed.design` says, a Figma link in `sources.figma` (open it with the Figma tools if you have them) or a screenshot in `reference/`. If there's nothing to compare with, say so; don't guess.

Compare what matters to a designer: size and spacing, colour, type (size and weight), corners, icons, and each state the references show. Check dark mode looks deliberate, not just inverted, and that nothing is unreadable or invisible in it. A difference the component's `.md` already lists under "Known differences" isn't a finding; one it doesn't list is. Screenshots can't show pressed or focused states unless an example draws them, so don't claim to have checked those.

If a check can't run (no network for `npm install`, no browser), say which and why in the report, and carry on with the rest: a review that skipped a check must say so.

## 3. Read it against the rules

Go through [references/checklist.md](references/checklist.md) section by section for each changed file: definition, markup and JS, styles, docs site, icons, writing, patterns. The script and build cover some rows; the rest need reading. These need the most care, because only a reader catches them:

- **`avoid`**: think which components someone might pick this one over by mistake, or pick instead of it, and check both definitions have an entry. A new component that looks like an existing one needs entries both ways round, so the existing one's definition may need one too.
- **`rules` and `purpose`**: would a designer reading only these choose and use it right?
- **Sources and origin**: in the app, or proposed? Pinned to a commit? Does `origin.kind` fit (the app's own, or mirroring a platform control)?
- **Real controls**: anything pressable is a real `<a href>`, `<button>` or form field, not a `<div>` with a click handler.
- **Comments and prose**: plain UK English, in the existing voice; comments say why (where a value comes from in the app), not what.
- **Commits**, for a branch or PR: `git log --format='%h %s%n%b' origin/main..HEAD`. Each subject short and imperative, each with a body saying why.

## 4. Report

Start with a short verdict, one or two sentences: ready to merge, ready once the must-fixes are done, or needs more work, and the main reason.

Then the findings, in three groups. Leave out a group with nothing in it.

- **Must fix**: breaks a rule in AGENTS.md or fails the build. It shouldn't merge like this.
- **Should fix**: against a rule, but small, or the rule allows a judgement and this looks like the wrong one.
- **Worth a look**: not clearly against a rule, but worth a second thought, such as a difference from the reference that's very slight, or something the rules don't cover.

Each finding:

```
**<file>:<line>**: <what's wrong, in plain words>
Rule: <the rule, quoted or close to it> (<where it comes from, such as AGENTS.md, Styles>)
Fix: <what to change, specifically enough to do it>
```

For example:

```
**src/components/status/status.css:24**: The gap uses 13px, which isn't one of the library's spacing sizes, and nothing says why.
Rule: "Spacing is on the 8pt grid ... Keep a value off the grid only where the app itself has it, and say so in a comment" (AGENTS.md, Styles)
Fix: Use calc(var(--app-space-small) + var(--app-space-extra-small)) for 12pt. If the design really has 13pt, keep it and add a comment saying where it comes from.
```

Write so a designer who has never written CSS can follow it. Explain a term the first time it appears, briefly, in brackets: "a token (a named value from `src/foundation/tokens.css`, such as `--app-space-medium` for 16pt)". Say what the reader would see, where you can: "in dark mode the label is dark grey on dark blue, and hard to read". Don't pad with praise or summaries of what's fine; a line saying which checks passed is enough.

After the findings, list what you ran and what you looked at, briefly: build passed or failed, the checker, which screenshots you compared with which references, and anything you couldn't check.

Finish by offering to fix the must-fixes (and the should-fixes, if there are any), and to run the review again afterwards. Don't fix anything until asked: the person may want to fix it themselves, or disagree.

## When another skill calls this

If you're running this as a step in another task, such as before opening a PR, do the same review and report, then go back to that task. Must-fixes should be fixed, or agreed with the person, before the PR is opened.
