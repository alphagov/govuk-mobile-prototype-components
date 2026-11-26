# When getting the prototype running goes wrong

For each, what it looks like, and what to do. Tell the person in a sentence what's happening; they don't need the detail.

## The address is taken

`npm start` finds the next free address from 3000 by itself, so this only shows as a different number: use the address it printed. If it says it couldn't start at all, something has every address from 3000 to 3020: run `PORT=4000 npm start` instead.

## Another copy is already running

If an old copy is running from another Claude window, the new one starts on the next address, and both work. That's fine. If they're confused by two, find the old one with `lsof -nP -iTCP -sTCP:LISTEN | grep node` and, with their say-so, stop it with `kill <pid>`.

## No Node.js, or too old

- `command not found: node`, or a version below 22.16: step 2 of the skill. Ask before installing.
- Installed by the skill, but `node` isn't found: the command didn't start with `export PATH="$HOME/.local/node/bin:$PATH";`.
- `SyntaxError`, or `import.meta.dirname is undefined`, from server.js: Node.js is older than 22.16. Same fix.
- The install script fails to download: see "The network", below. If it says the checksum didn't match, the download was broken: run it again.

## npm install fails

Read the error, then say in plain words what's happening.

- **The network**: `ETIMEDOUT`, `ECONNRESET`, `ENOTFOUND`, `EAI_AGAIN`, or a failure downloading from github.com or nodejs.org. Ask if they're on the VPN, or a network that blocks some sites, and try again once they've changed. A network may need a proxy: if `HTTPS_PROXY` is set in their environment, npm uses it; if not, they'll need to ask their IT support for the proxy's address.
- **Certificates**: `SELF_SIGNED_CERT_IN_CHAIN` or `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`. Their network inspects secure connections. Don't turn certificate checks off. Explain, and suggest they ask IT support how to use npm on their network, or try another network.
- **Permissions**: `EACCES`. Don't use sudo. The prototype folder may belong to another user: `ls -ld .` shows who. If it's in a folder they can't write to, offer to make the prototype in their Documents folder instead.
- **A half-finished install**: anything else. Delete `node_modules` and `package-lock.json` and run `npm install` once more. If it fails again, tell them what the error says in plain words, and suggest they share it with whoever looks after the prototype kit.

## Updating the components

`node scripts/use-latest-components.js` asks GitHub for the latest release. If it says GitHub is limiting how often the network can ask, wait an hour or try another network: nothing's wrong with the prototype, which keeps its version until then.

## There's no catalogue

The catalogue comes ready-made in each release of the components. If `node_modules/govuk-mobile-prototype-components/catalogue/index.md` isn't there, `package.json` points at something that isn't a release, such as a copy of the components' source. Fix it: run `node scripts/use-latest-components.js`, then `npm install`, check the screens still load, and save a version if the prototype keeps them.

## The browser says it can't connect

"This site can't be reached", or "refused to connect": the prototype isn't running. It stops when the Claude window that started it closes. Run steps 4 and 5 of the skill again.

## A screen is blank, or shows plain text and no phone

The page can't load the components. Open the address of one of its scripts with curl: a 404 means the path is wrong. Screens load the library from `/library/`, at the address `node library.js` prints as `libraryUrl`, not from `../../` or `node_modules/`. If the components were updated and moved their files, `source` in `library.js` must match.

## The page doesn't update after a change

It reloads by itself when a file in the prototype changes. If it doesn't, the server may have stopped (restart it), or the tab was opened before it started: ask them to reload the page once.
