---
name: prototype-setup
description: Gets this GOV.UK app prototype running on this computer and opens it in the browser - checks Node.js is there (installing it into the home folder if not, with permission), installs the prototype's parts, starts it and keeps it running. Use it at the start of every session in this prototype, and whenever someone says "open my prototype", "start the prototype", "show me my prototype", "carry on with my prototype", "it's not loading", "the page won't open", "localhost isn't working" or "refused to connect", even if they don't say "setup".
---

# Get the prototype running

The person is a designer, who may never have used a terminal. They want to see their prototype in a browser; everything between here and there is yours to do. Say what's happening in a sentence or two, in plain words, as you go. Ask before installing anything on their computer. Never paste an error at them: say what went wrong, and what you're doing about it. If something here fails, [references/troubleshooting.md](references/troubleshooting.md) has what to do.

These steps are for a Mac, which is what GDS designers have. On anything else, do the same things that platform's way.

## 1. Find the prototype

This folder is the prototype if it has `prototype.json` and `server.js`. If it doesn't, look in the folders inside it: one prototype, use it; several, ask which, by name (`prototype.json`'s `name`). Run every command below in the prototype's folder.

## 2. Check for Node.js

The prototype runs on Node.js, version 22.16 or newer. Check quietly: `node --version`. If that isn't there or is too old, look for one installed before by this skill: `~/.local/node/bin/node --version`. If that one's new enough, use it: start each command with `export PATH="$HOME/.local/node/bin:$PATH";`, since each command runs in a new shell.

If neither will do, explain in one sentence, and ask: "The prototype runs on a free program called Node.js, which your computer doesn't have yet. Can I download it from nodejs.org into your own folder? It doesn't need your password or change anything else, and takes about a minute." With their yes:

```sh
sh .claude/skills/prototype-setup/scripts/install-node.sh
```

It installs the latest long-term support version into `~/.local/node`, checked against nodejs.org's checksums. Then use it as above.

## 3. Install the prototype's parts

If `node_modules/govuk-mobile-prototype-components` isn't there, run `npm install`. Say first: "I'm downloading the GOV.UK app components. It takes a few seconds."

## 4. Start it

If it's running already, don't start a second copy: look for a server you started earlier in this session, or try `curl -s http://localhost:3000/ | grep -o '<title>[^<]*'` (and 3001, 3002...) for one that answers. The start page's title is the prototype's name.

Otherwise run `npm start` **in the background** (the Bash tool's `run_in_background`), so it keeps running while you carry on. It prints a line like `http://localhost:3000`: wait for it by reading the output, a second or two, then take the address from there, not from memory. If 3000 is taken, it uses the next free one.

## 5. Open it

`open <address>` opens it in their browser, at the start page, which lists every screen. If you've just made or changed a screen, open that screen's address instead.

Then tell them, in two or three sentences, something like:

> Your prototype is open in your browser at http://localhost:3000. It's only on your computer, and it updates by itself whenever I change it, so you can keep that tab open while we work. It runs while this Claude window is open; next time, open Claude in this folder and say "open my prototype".

If it's new, or they're not sure what to do next, add what they can ask for, in a sentence or two: a new journey or screen, described in words ("a journey to add a vehicle and get MOT reminders"), from a Figma link or a screenshot, or a change to a screen that's there ("add a Vehicles row to Settings"). The `prototype-build` skill does those. They can also say "get the latest components" (`prototype-update-library`), or "add this to the library" for something made just for this prototype (`prototype-propose-component`).

If they ask how to stop it: you stop it (stop the background task), or it stops when they close Claude. To restart, run steps 4 and 5 again.
