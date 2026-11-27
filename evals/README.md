# Evals

Tests of the skills, in this repository's `.claude/skills/` and the starter's `src/starter/skills/`: whether Claude reaches for the right one, chooses well from the catalogue, reviews well, and does whole jobs well. The [Evals page](https://alphagov.github.io/govuk-mobile-prototype-components/evals/) on the docs site explains them for anyone, and shows the latest published results.

They run on your computer, not in CI, with the `claude` CLI that's installed and signed in there, for everything: the skill being tested, the simulated designer and the screenshot judge. No API key, and nothing else to pay for. Node's own modules, and this repository's Playwright for the checks that click through a prototype and for the published screenshots.

## Run them

```sh
npm install                              # once, for Playwright
npx playwright install chromium          # once, if you haven't

npm run evals                            # layers 1 to 3
npm run evals -- --full                  # and layer 4, each task once: prints an estimate, then asks
npm run evals -- --full --runs 3         # each task 3 times, before a big release
npm run evals -- --case local-council
npm run evals -- --case local-council,onboarding   # several, with commas
npm run evals -- --layer 2,3             # some layers
npm run evals -- --baseline              # also without the skills, to compare
npm run evals -- --publish               # and publish to the docs site
npm run evals -- --note "After rewording prototype-build"   # say why, in the history and on the site
npm run evals:publish evals-out/<stamp>  # publish a run that's already done
npm run evals -- --regrade evals-out/<stamp>  # grade its whole tasks again, after their checks change
```

`--regrade` runs nothing again: it grades the conversations from their transcripts, and, if the run used `--keep`, the code checks on what each task made.

Other options: `--runs N` (each case N times, 1 by default), `--concurrency N` (4 at a time for layers 1 to 3, 2 for layer 4), `--model sonnet` (the CLI's default otherwise), `--yes` (no question before layer 4), `--keep` (keep the working folders, to look at what a task made).

Each run makes everything it needs in the computer's temporary folder, never in this checkout: a prototype made with the `new` command from `npm pack` of this working tree, and a clone of this repository whose `origin` is a bare copy beside it, so nothing a skill does can reach GitHub. The skills tested are the ones in your working tree, changes not yet committed too.

## What each layer checks

| Layer | Asks | How it's run | How it's graded | Cost |
| --- | --- | --- | --- | --- |
| 1. Triggering | Does a designer's message start the right skill, or none? | `claude -p` in a prototype, or the library, stopped as soon as it reaches for a skill (the Skill tool, or reading a `SKILL.md`), within 8 tool calls. It may read, not change | Code: precision and recall per skill. `prototype-setup` before another skill is allowed, as its description says to use it at the start of every session | About 40 short runs, a minute or two |
| 2. Choosing | Given a brief, does it choose what the library's rules say? | `claude -p` in a copy of the catalogue, with only the Read tool, answering in a fixed JSON shape (`--json-schema`) | Code: required templates, patterns and elements there; forbidden ones not. Records what it read | About 17 runs, a minute |
| 3. Reviewing | Does `library-review` find planted faults, and raise no false alarms? | Faults planted in real components in a throwaway clone, left uncommitted; then "review my changes" | Code: each planted fault's file and words for its rule in a finding of the report; must or should fixes on clean changes are false alarms. `check.js` alone on the same change, for comparison | 9 runs, each with a build and screenshots: a few minutes, 4 at a time |
| 4. Whole tasks | Does a skill do a whole job well, with a designer? | One `claude` session per task (stream-json in and out), in a fresh prototype or clone, answered by a simulated designer, another `claude -p` with a persona and the brief, until it hands over, reaches a push or pull request, or 8 to 12 turns | Code checks on the result, a screenshot judge, and conversation checks (below) | 4 to 25 minutes and 1 to 5 million tokens, mostly cached, per task |

Layer 4's checks:

- **Code**: every page loads with no console errors, every element is the library's or a custom one in `components/`, links go somewhere, a scripted click-through of the journey works (remembered answers too), custom CSS uses only `--app-*` tokens on the grid, and the case's required parts are there. For the library: a new component folder, `npm run build` passes, `check.js` finds no must-fixes, and it's committed on a branch with good messages.
- **The screenshot judge**: `claude -p`, reading the light and dark screenshots of what was made beside the app's own Settings and Home, and the design if there was one, scores four things 1 to 5 with a reason. For trends, not pass or fail.
- **The conversation**: at most one question a turn, a plan with a question before any screen is written (for cases that need one), asking before any install, and a count of jargon (npm, git, commit, repo, branch, CLI, terminal, JSON, node_modules) in what the designer was shown.

### What a session may do

Layer 4 runs unattended, so it can't ask permission. `--permission-mode acceptEdits` lets it change files in its own folder, `--allowedTools` lists the commands it may run (npm, node, ls, git add and commit, and the like), and `--permission-prompts none` refuses anything else rather than asking. It may never `git push`, `gh pr`, `open` or search the web. That's a fence, not a sandbox: the commands it may run, such as `node`, could reach outside its folder if it tried. A library task is stopped as soon as it tries to push or open a pull request, which counts as reaching the end.

Every call uses only the project's settings (`--setting-sources project,local`) and no MCP servers, so your own skills and plugins don't change the results.

## Cost

Everything runs on your Claude Code access, so it costs what Claude Code costs you. The report gives each layer's tokens, and the CLI's own cost estimate at list prices. The first published run, `--full` with each whole task once, took 17 minutes and 11.6 million tokens, most of them cached reads, about $12 at list prices: layers 1 to 3 were 5 minutes and 3.6 million tokens (about $6), and the 6 whole tasks 12 minutes and 8 million (about $6.50), 2 at a time. That's cheap enough to run every week or two, or after changing a skill. `--full` prints an estimate and asks first. A task can go differently each time, so before a big release run `--full --runs 3`, to see how much it varies. When changing one skill, run its cases with `--case`.

## Add a case

Cases are data, in `evals/cases/`. Add one to the file for its layer; no code changes.

- `triggering.json`: `{ "id", "fixture": "prototype" | "library", "expect": "<skill>" | null, "prompt" }`. A case for a skill the fixture hasn't got yet is listed as pending, and runs once the skill is there.
- `choosing.json`: `{ "id", "brief", "require": [...], "forbid": [...] }`. Each is `template:<name>`, `pattern:<name>`, `custom`, an element such as `govuk-app-text-field`, or an element with values for one attribute, `govuk-app-button[variant=primary|]` (an empty value means left out). An array inside `require` is any one of them.
- `reviewing.json`: `{ "id", "prompt", "clean": true?, "edits": [{ "file", "find", "replace" } or { "file", "append" }], "faults": [{ "id", "file", "rule", "match" }] }`. `find` must be in the file exactly once. A fault is found when a finding's heading names `file` and its text matches `match`, a regular expression.
- `tasks.json`: `{ "id", "kind": "prototype" | "library", "skill", "title", "opening", "brief", "plan", "maxTurns", "estimate", "design"?, "checks" }`. `opening` is the designer's first message, `brief` what the simulated designer knows. `checks.requires` are CSS selectors to find on some page (`page` to say which, `text` for words inside, `min` for how many), `checks.forbids` ones not to find, and `checks.journey` the click-through: open a page, press a link, button or menu item by its name, type in a field, turn on a switch and see it's still on later, and see words or an address, as `lib/prototype-checks.js` lists. `"showcase": true` makes it the one the docs site shows in full.

The prompts for the simulated designer, the judge and the choosing layer are in `evals/prompts/`.

## Read the report

Each run writes `evals-out/<stamp>/`, which git ignores:

- `report.html`: a summary of each layer against the last run's, then every case, with why each failure failed, its tokens and time, and a link to its transcript. Layer 4 shows each task's checks, the judge's scores and reasons, the screenshots side by side, and the start of the conversation.
- `results.json`: everything, as data.
- `transcripts/`, `tasks/`: the CLI's stream-json for each run, and a readable copy, made with the report.

`evals-out/history.jsonl` gets a line for every run, with its scores alone, for the trend.

## Publish to the docs site

`--publish` (or `npm run evals:publish evals-out/<stamp>`) writes a small snapshot into the docs: `docs/_data/evals/history.json` (each published run's scores) and `latest.json` (the latest of each layer, with short excerpts, and no paths from your computer), and the screenshots its showcase shows, as small WebP, in `docs/evals/images/`. Publishing a run of some layers replaces only those. Check the page with `npm start`, at <http://localhost:8080/evals/results/>, then commit those files in a pull request.

Read the excerpts before you commit them: they're what Claude and the simulated designer said, and should hold nothing private, but you're publishing them.
