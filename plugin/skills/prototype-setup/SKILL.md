---
name: prototype-setup
description: Gets a GOV.UK app prototype running on this computer and opens it in the browser - checks the computer has what it needs (git, Node.js), installs the prototype's parts, starts it and keeps it running. Use it at the start of every session in a prototype folder, and whenever someone says "open my prototype", "start the prototype", "show me my prototype", "carry on with my prototype", "it's not loading", "the page won't open", "localhost isn't working", "refused to connect" or "set up my computer". Also run by prototype-new after it makes a prototype. Use it even if they don't say "setup".
---

# Get a prototype running

The person is a designer, who may never have used a terminal. They want to see their prototype in a browser; everything between here and there is yours to do. Say what's happening in a sentence or two, in plain words, as you go. Ask before installing anything on their computer. Never paste an error at them: say what went wrong, and what you're doing about it. If something here fails, [references/troubleshooting.md](references/troubleshooting.md) has what to do.

Work out which computer you're on first (`uname`). These steps are for a Mac, which is what GDS designers have. On anything else, do the same things that platform's way.

## 1. Find the prototype

A prototype folder has `prototype.json`, `server.js` and `package.json` in it.

- If the current folder is one, use it.
- If not, look in the folders inside it. One prototype: use it. Several: ask which, by name (`prototype.json`'s `name`), one question.
- None: ask if they'd like to make a new prototype, and if so use the `prototype-new` skill.

Run every command below in the prototype's folder.

## 2. Check the computer has what it needs

Do these checks quietly. Only talk about one if something's missing.

**git**, which installs the GOV.UK app components from GitHub, and keeps the prototype's versions. `git --version`.

If it's missing, on a Mac it comes with Apple's free Command Line Tools. Explain, in about these words: "Your Mac needs some free tools from Apple before the prototype can work. A window will open asking to install them: choose Install, and agree to the licence. It takes about 5 to 10 minutes. Tell me when it's finished." Then run `xcode-select --install`, wait for them to say it's done, and check `git --version` again.

**Node.js 22.16 or newer**, which runs the prototype. `node --version`.

If it's missing or older, explain: "The prototype runs on a free program called Node.js. Your computer [doesn't have it / has an old version]. Can I install the latest version for you? It only changes things for your user, not the whole computer, and takes a couple of minutes." With their yes, install it with nvm, the Node version manager:

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh"; nvm install --lts && nvm alias default 'lts/*'
```

nvm only works in a shell that has loaded it, and each command you run starts a new shell. So from here on, if `node --version` isn't new enough, start each command with `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh";`. If nvm is there already (`~/.nvm/nvm.sh` exists), skip the install and use it.

## 3. Install the prototype's parts

If `node_modules/govuk-mobile-prototype-components` isn't there, or the prototype's `package.json` has changed since, run `npm install`. Say first: "I'm downloading the GOV.UK app components. It can take a minute or two."

Then check `node_modules/govuk-mobile-prototype-components/catalogue/index.md` is there. If it isn't, see the troubleshooting.

## 4. Start it

If it's running already, don't start a second copy: look for a server you started earlier in this session, or try `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` (and 3001, 3002...) for one that answers 200 with this prototype's name in its page title. If it's running, skip to step 5 with its address.

Otherwise run `npm start` **in the background** (the Bash tool's `run_in_background`), so it keeps running while you carry on. It prints a line like `http://localhost:3000`: wait for it by reading the output, a second or two, then take the address from there, not from your memory. If 3000 is taken, it uses the next free one, so the address may be 3001 or later.

## 5. Open it

`open <address>` opens it in their browser, at the start page, which lists every screen. If you've just made or changed a screen, open that screen's address instead.

Then tell them, in two or three sentences, something like:

> Your prototype is open in your browser at http://localhost:3000. It's only on your computer, and it updates by itself whenever I change it, so you can keep that tab open while we work. It runs while this Claude window is open; next time, open Claude in this folder and say "open my prototype".

If they ask how to stop it: you stop it (stop the background task), or it stops when they close Claude. To restart, run steps 4 and 5 again.
