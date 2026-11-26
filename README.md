# GOV.UK Mobile Prototype Components

Web components that look and behave like the GOV.UK app's own, so a prototype of an app journey can be built from HTML, or by asking Claude Code for it in plain words.

Each component matches one the app has, or one proposed for it. It's a web component in plain JavaScript, with no framework or build step, and carries its own HTML, CSS and JavaScript, so it works on its own. Beside it, a definition in JSON says what it's for, what it takes, when to use something else and where it comes from, for people and for tools that build prototypes.

**Documentation:** <https://alphagov.github.io/govuk-mobile-prototype-components/>, with every component drawn live in light and dark beside the app's own screenshots.

## Make a prototype

Open [Claude Code](https://code.claude.com/docs/en/overview) in the folder where you keep your work, and paste:

> Make me a prototype of the GOV.UK app using https://github.com/alphagov/govuk-mobile-prototype-components

Claude asks what to call it and where in the app to start, gets your computer ready, asking before it installs anything, and opens the prototype in your browser. See [Make a prototype](https://alphagov.github.io/govuk-mobile-prototype-components/get-started/make-a-prototype/) for more.

## Use the components

Install a [release](https://github.com/alphagov/govuk-mobile-prototype-components/releases), then load a component's script and write its element inside a `<govuk-app>`:

```sh
npm install https://github.com/alphagov/govuk-mobile-prototype-components/releases/download/v0.7.0/govuk-mobile-prototype-components.tgz
```

```html
<script type="module" src="node_modules/govuk-mobile-prototype-components/src/components/button/button.js"></script>

<govuk-app>
  <govuk-app-button name="continue">Continue</govuk-app-button>
</govuk-app>
```

See [Get started](https://alphagov.github.io/govuk-mobile-prototype-components/get-started/) for the rest.

## Work on the library

You need Node.js 26, the version in `.nvmrc`. Anything from 22.16 works.

```sh
npm install
npm start
```

Then open <http://localhost:8080>. Read [AGENTS.md](AGENTS.md) for the rules we've agreed, and [Work on the library](https://alphagov.github.io/govuk-mobile-prototype-components/get-started/work-on-the-library/) for the build, screenshots and releasing.

## What's where

| Path | What it holds |
| --- | --- |
| [src/](src/) | The library, and everything a release holds: components, patterns, templates, the app's tokens (`foundation/`), the iPhone around a prototype (`frame/`), the definitions' schemas, and the starter a new prototype is made from |
| [examples/](examples/) | Screens of the app built from the components, to see them working together |
| [docs/](docs/) | The documentation site |
| [scripts/](scripts/) | The catalogue and the screenshots |
| [inventory/](inventory/COMPONENTS.md) | Every component in the iOS and Android apps today, with screenshots. The backlog |

## If you're Claude

Someone has asked you to make a prototype of the GOV.UK app with this library. They're probably a designer who's never used a terminal: talk in plain, short UK English, one question at a time, and do the technical work yourself.

1. **Ask** what to call the prototype, then where in the app to start: Home, Settings or Chat (which come together, as their tab bars link to each other), or a blank screen.
2. **Check for Node.js** 22.16 or newer: `node --version`, or, if an earlier prototype installed it, `~/.local/node/bin/node --version`. If neither will do, say in one sentence that the prototype runs on a free program called Node.js, and ask to download it from nodejs.org into their own folder. It needs no password and no developer tools. With their yes, on a Mac:

   ```sh
   case "$(uname -m)" in arm64) platform=darwin-arm64 ;; *) platform=darwin-x64 ;; esac
   index=$(curl -fsSL https://nodejs.org/dist/index.tab)
   version=$(printf '%s\n' "$index" | awk -F'\t' 'NR > 1 && $10 != "-" { print $1; exit }')
   name="node-$version-$platform"
   mkdir -p "$HOME/.local" && cd "$HOME/.local"
   curl -fsSLO "https://nodejs.org/dist/$version/$name.tar.gz"
   curl -fsSL "https://nodejs.org/dist/$version/SHASUMS256.txt" | grep " $name.tar.gz\$" | shasum -a 256 -c -
   tar -xzf "$name.tar.gz" && rm "$name.tar.gz" && ln -sfn "$HOME/.local/$name" "$HOME/.local/node"
   ```

   That's the latest long-term support version, checked against nodejs.org's checksums. Use it by starting each command with `export PATH="$HOME/.local/node/bin:$PATH";`.
3. **Make it**, in the folder Claude Code is open in (if that's their home folder, suggest their Documents folder instead), with the name and starting point they gave: `--from settings`, `home`, `chat` or `blank`.

   ```sh
   npx --yes https://github.com/alphagov/govuk-mobile-prototype-components/releases/latest/download/govuk-mobile-prototype-components.tgz new "My prototype" --from settings
   ```

   It makes a folder named after the prototype, downloads the latest release of the components into it, and adds the starter, the screens and the skills Claude uses to work on it, in `.claude/skills/`. If it fails, say what it said in plain words: it's usually the network.
4. **Open it.** Read the new folder's `CLAUDE.md`, and follow its `.claude/skills/prototype-setup/SKILL.md`, in that folder, to start the prototype and open it in their browser. Then tell them what they can ask for, and that next time they should open Claude Code in the prototype's folder and say "open my prototype", so its skills are there.

## Licence

MIT, except the GOV.UK crown and wordmark, which are Crown copyright and only for GOV.UK services, and the fonts, which have licences of their own. See [LICENSE](LICENSE).
