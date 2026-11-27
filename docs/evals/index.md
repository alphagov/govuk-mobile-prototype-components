---
layout: evals
title: Evals
description: How we check that Claude, following this library’s skills, chooses, builds and reviews the way we’d want it to.
sectionKey: Evals
order: 1
---

A designer can make a prototype of the GOV.UK app by asking Claude Code for it in plain words. Claude follows **skills** we’ve written: instructions for how to set up a prototype, build screens from the library, review a change to the library, or add a component to it. Evals are how we find out whether those skills work.

[See the latest results](/evals/results/).

## What an eval is

An eval is a test for an AI agent. It’s like a test of code, with two differences:

- **The answer isn’t always the same.** Ask Claude the same thing twice and it may do it a little differently. So we run a case more than once, and look at how often it does the right thing: a pass rate, not a pass.
- **“Right” is sometimes a judgement.** Whether a screen looks like the app can’t always be checked by code. So some checks are code, some are another Claude, acting as a judge, and some are for people to read.

We write down cases, each with what a good result is, run them with the real skills and the real Claude, and grade the results. When we change a skill, we run them again and see whether it got better or worse.

## Why we have them

The skills decide what designers get. A change that reads well can still make Claude reach for the wrong skill, pick a primary button for deleting something, miss a raw colour in a review, or ask a designer three questions at once. Evals catch that before a designer does, and show us whether a change to a skill helped.

They run on a computer of ours, with Claude Code, not on every pull request: a full run takes about an hour of Claude’s work, and we run each task three times before a big release.

## The four layers

Each layer tests one thing a skill has to get right, from cheapest to dearest.

### 1. Triggering: does the right skill start?

A short message, as a designer would type it, typos and all, and which skill it should start, or none. We send it to Claude in a real prototype (or a copy of this library) and stop as soon as we can see which skill it reached for.

> “can you show me my protoype in the browser please” should start **prototype-setup**.
>
> “whats the difference between a sheet and a full screen cover in the app? just curious” should start **no skill**: it’s a question, not a job.

Graded by code: for each skill, how many of the messages meant for it started it (recall), and how many it started that weren’t meant for it (precision).

### 2. Choosing: does it pick the right parts?

A brief for a screen, and an answer we’ve agreed: what it must use, and what it mustn’t. Claude reads the library’s catalogue, as a prototype’s skills do, and answers in a fixed form.

> **Brief:** Before the user’s chat history is deleted, ask them if they’re sure.
>
> **Must use:** the Confirmation pattern, and a destructive button. **Mustn’t use:** a primary button.

Graded by code, against the agreed answer. We also count how much of the catalogue it read to choose.

### 3. Reviewing: does a review find what’s wrong?

We plant faults in a copy of a real component, such as a raw colour where a token should be, spacing off the 8pt grid with no comment saying why, or an icon named as Apple’s SF Symbols, and ask for a review, as someone would. Some cases have no faults, to catch false alarms.

> In the address component, the name’s colour changed to `#0b0c0c`, and its gap to `10px`. A good review finds both, and names the rule each breaks.

Graded by code: how many planted faults the review’s report names (the file, and the rule), and how many “must fix” or “should fix” findings it raises on a clean change. The review’s own rule checker, `check.js`, runs on the same change for comparison.

### 4. Whole tasks: does it do the whole job well?

A whole job, from a designer’s first message to the hand-over, in a fresh prototype: setting your local council, choosing your notifications in Settings, deleting your chat history with a confirmation, onboarding that branches on an answer, a screen made from a screenshot of the app, or adding a component to the library.

The designer is **simulated**: another Claude, given a persona and a brief. It’s a designer who’s never written code, knows what the app should do, answers the question it’s asked, says yes to a good plan, and never helps with anything technical. It keeps talking until the skill hands over.

> **Designer:** I’d like a journey for setting your local council. You type your postcode, choose your address from a list, confirm it, and then Home shows a card with your bin collections.
>
> **Claude:** Here’s what I’d make, 4 screens starting from Home… Shall I build it?
>
> **Designer:** Yes, that’s what I had in mind.

## How it’s graded

**Code checks**, on what was made: every screen loads with no errors, every part is one of the library’s (or a custom one made the library’s way), every link goes somewhere, a scripted click through the journey works, with remembered answers showing where they should, custom styles use only the app’s tokens, and what the case needs is there, such as a destructive button. For example, in the local council journey, the postcode typed on one screen must show on the confirm screen. For a library task: the build passes, the rule checker finds nothing that must be fixed, and the work is saved on a branch of its own.

**A screenshot judge**: another Claude looks at the screens in light and dark, beside the app’s own, and scores each from 1 to 5, with a reason: does it look like the GOV.UK app, is the hierarchy clear, does dark mode hold up, does it match the design it was given. Judges vary, so we use these for trends, not as pass or fail.

**Conversation checks**, from the transcript: one question at a time, a plan shown and agreed before building, asking before installing anything, and no jargon (npm, git, commit, repo, branch, terminal, JSON and the like) in what the designer reads.

## Run them

From this repository, with Claude Code installed and signed in:

```sh
npm run evals                    # layers 1 to 3, a few minutes
npm run evals -- --full          # and layer 4, each task once, after an estimate and a yes
npm run evals -- --case <id>     # one case
npm run evals -- --publish       # and publish the results to this page
```

Each run writes a report to `evals-out/`, with every case, why each failure failed, and the transcripts. The cases are data, in `evals/cases/`, so adding one needs no code. [evals/README.md](https://github.com/alphagov/govuk-mobile-prototype-components/blob/main/evals/README.md) says more.
