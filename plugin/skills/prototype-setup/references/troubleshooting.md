# When getting a prototype running goes wrong

For each, what it looks like, and what to do. Tell the person in a sentence what's happening; they don't need the detail.

## The address is taken

`npm start` finds the next free address from 3000 by itself, so this only shows as a different number: use the address it printed. If it says it couldn't start at all, something has every address from 3000 to 3020: run `PORT=4000 npm start` instead.

## Another copy is already running

If an old copy is running from another Claude window, the new one starts on the next address, and both work. That's fine. If they're confused by two, find the old one with `lsof -nP -iTCP -sTCP:LISTEN | grep node` and, with their say-so, stop it with `kill <pid>`.

## Node.js is too old, or "command not found: node"

- Too old (below 22.16), or missing: step 2 of the skill. Ask before installing.
- nvm installed it, but `node` isn't found: the shell hasn't loaded nvm. Start the command with `export NVM_DIR="$HOME/.nvm"; . "$NVM_DIR/nvm.sh";`.
- Installed some other way (Homebrew, the installer from nodejs.org) and old: nvm is still the simplest fix, and doesn't touch the other one. Ask first.
- `SyntaxError` or `import.meta.dirname is undefined` from server.js: Node.js is older than 22.16. Same fix.

## git is missing

`xcrun: error: invalid active developer path`, or `git: command not found`. Apple's Command Line Tools aren't installed: step 2 of the skill. If `xcode-select --install` says they're installed already but git still fails, run `sudo xcode-select --reset`: that asks for their Mac password, so explain why first. If they don't have admin rights on their Mac, they'll need to ask their IT support for the Command Line Tools.

## npm install fails

Read the error, then say in plain words what's happening.

- **The network**: `ETIMEDOUT`, `ECONNRESET`, `ENOTFOUND`, `EAI_AGAIN`, or a failure fetching from github.com or registry.npmjs.org. Ask if they're on the VPN, or a network that blocks some sites, and try again once they've changed. On a GDS laptop, the network may need a proxy: if `HTTPS_PROXY` is set in their environment, npm uses it; if not, they'll need to ask their IT support for the proxy's address.
- **Certificates**: `SELF_SIGNED_CERT_IN_CHAIN` or `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`. Their network inspects secure connections. Don't turn certificate checks off. Explain, and suggest they ask IT support how to use npm on their network, or try another network.
- **git can't reach GitHub**: `Permission denied (publickey)`, `could not read Username`, `Repository not found`, or a request for a password. The components' repository on GitHub may be private, so this computer has to be signed in to GitHub with an account that can see it. Check with `git ls-remote git@github.com:alphagov/govuk-mobile-prototype-components.git` and the same over `https://github.com/...`. If neither works, explain they need a GitHub account with access to the GOV.UK app prototype components (whoever looks after the prototype kit can give it), and to sign this computer in to it. With their say-so, GitHub's own `gh auth login` does that, in the browser, if `gh` is installed. Also run `git config --global --get-regexp url` for a rule that rewrites https to ssh; if there is one, explain it and ask before changing it.
- **Permissions**: `EACCES`. Don't use sudo. The prototype folder may belong to another user: `ls -ld .` shows who. If it's in a folder they can't write to, offer to make the prototype in their Documents folder instead.
- **A half-finished install**: anything else. Delete `node_modules` and `package-lock.json` and run `npm install` once more. If it fails again, tell them what the error says in plain words, and suggest they share it with whoever looks after the prototype kit.

## There's no catalogue

The catalogue comes ready-made in each release of the components, from v0.4.0. If `catalogue/index.md` isn't in the installed library, `package.json` points at something that isn't such a release: `main`, a commit, or an older version. Fix it: run `node scripts/use-latest-components.js`, then `npm install`, check the screens still load, and save a version. If the script says there's no release yet, see below.

## "The components haven't been released yet"

`use-latest-components.js` found no release from v0.4.0 on GitHub. There's nothing the designer can do: tell them the components aren't ready to make prototypes with yet, and to ask the library's maintainers. Don't install from `main` instead: it has no catalogue, and isn't a version anyone has checked.

## The browser says it can't connect

"This site can't be reached", or "refused to connect": the prototype isn't running. It stops when the Claude window that started it closes. Run steps 4 and 5 of the skill again.

## A screen is blank, or shows plain text and no phone

The page can't load the components. Open the address of one of its scripts with curl: a 404 means the path is wrong. Screens must load the library from `/library/`, at the URL `node library.js` prints as `libraryUrl`, not from `../../` or `node_modules/`. If the library was updated and moved its files, `source` in `library.js` must match. Look in the browser's console too, if you can: a component's error names what it couldn't load.

## The page doesn't update after a change

It reloads by itself when a file in the prototype changes. If it doesn't, the server may have stopped (restart it), or the tab was opened before it started: ask them to reload the page once.
