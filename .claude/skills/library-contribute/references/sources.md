# Where things come from

The app's code is public, on GitHub, in three repos. Read them with `gh`, signed in.

| Repo | What's in it |
| --- | --- |
| `govuk-once/govuk-mobile-ios-gov-kit` | iOS's shared design system, GovKit: buttons (`GovKitUI/Sources/Components/Buttons/`), the grouped list, section headings, colours (`GovKitUI/Sources/Colors/`, `GOVUKColors+Fills`, `+Text`, `+Strokes`), type (`Font+Extensions`, `UIFont+Extensions`) |
| `govuk-once/govuk-mobile-ios-app` | The iOS app: its own components (`Production/govuk_ios/SwiftUIViews/`, `UIKitViews/`, `Views/Common/`), its screens (`Production/govuk_ios/Views/`, `ViewModels/`, by feature), its words (`Production/govuk_ios/Resources/Strings/*.xcstrings`), and colours of its own (`Production/govuk_ios/Extensions/GovKit/`) |
| `govuk-once/govuk-mobile-android-app` | The Android app: its design system (`design/src/main/kotlin/uk/gov/govuk/design/ui/component/`, colours in `design/.../ui/theme/Color.kt`, spacing in `Spacing.kt`), and each feature's screens (`feature/<name>/src/main/kotlin/...`) |

`inventory/COMPONENTS.md` lists every component in both apps, by the names in their code, with screenshots: start there to know what to search for. It was surveyed at the commits in its first table, which may be behind `main` now.

## Finding the code

```sh
gh search code --repo govuk-once/govuk-mobile-ios-app "DividerView" --json path -q '.[].path'
gh search code --repo govuk-once/govuk-mobile-android-app "ListDivider(" --json path -q '.[].path'
```

Search finds only the default branch, `main`. Something only on a feature branch (the inventory says which) needs that branch's tree, as `reference.js find --ref` reads.

Search a component's name to find where it's defined, then where it's used, to see it on a real screen: a component used nowhere may not be worth building.

## Pinning the commit

Read every file at one commit, and record it, so the next person sees what you saw. Take the head of `main` at the start:

```sh
gh api repos/govuk-once/govuk-mobile-ios-app/commits/main --jq .sha
```

Then read each file at that commit. Quote the URL: zsh, the Mac's shell, takes `?` for a wildcard.

```sh
gh api "repos/govuk-once/govuk-mobile-ios-app/contents/Production/govuk_ios/Views/Common/DividerView.swift?ref=3813aa2a" --jq .content | base64 -d
```

In the definition, each source has the `repo`, the `path`, the `symbol` (the type or function, and what of it you used, such as `ButtonConfiguration .primary`), and `ref`, the commit, cut to 8 characters as the others are. The same goes for a pattern's or template's `sources`, and for a token's comment in `tokens.css`.

## What to read for

- **Sizes and spacing**: the numbers in the code (`heightAnchor.constraint(equalToConstant: 0.33)`, `padding(16.dp)`, `UIEdgeInsets`), not measured from screenshots. iOS points and Android dp are the same as the library's px.
- **Colours**: the token the code names (`UIColor.govUK.strokes.listDivider`, `GovUkTheme.colourScheme.strokes.listDivider`). Find its library token in `src/foundation/tokens.css`, whose comments name GovKit's tokens. If it's missing, read its light and dark values in GovKit's `GOVUKColors+*.swift` and add it.
- **Type**: the text style (`.body`, `.subheadline`, `GovUkTheme.typography.bodyRegular`), which matches an `--app-font-*` token.
- **When the code and the screenshot disagree**, the screenshot is what people see: match it, and say why in the CSS's comment and `origin.notes`. For example, the iOS app gives SwiftUI's `Divider` the list divider's blue, but a `Divider` keeps the system's grey, and that's what the snapshots show.
- **Behaviour**: what it does when pressed, focused or disabled, and on each platform. Where iOS and Android differ, the library draws iOS, and says so in `origin.notes`.

## The app's screenshots

The library compares each component with the app's own screenshots, from the snapshot tests both apps run. They're PNGs in the repos:

- iOS app: `Tests/govuk_ios/govuk_ios_snapshot_tests/ReferenceImages_64/govuk_ios_snapshot_tests.<View>SnapshotTests/test_<case>@3x.png`
- GovKit: `GovKitExample/ReferenceImages_64/GovKitUISnapshotTests.<View>SnapshotTests/test_<case>@3x.png`
- Android: `<module>/src/screenshotTestDebug/reference/<package>/<Thing>ScreenshotTests/<Preview>_<hash>_0.png`. The design module's are only on the branch `GOVUKAPP-4072-screenshot-test` for now.

`inventory/screenshots/index.json` says where each of the inventory's screenshots came from, in `from`. Treat it as a lead: a few entries name the wrong repo.

Find and copy them with the skill's script, from the repository's root:

```sh
node .claude/skills/library-contribute/scripts/reference.js find divider
node .claude/skills/library-contribute/scripts/reference.js find button --ref GOVUKAPP-4072-screenshot-test --repo android-app
node .claude/skills/library-contribute/scripts/reference.js fetch \
  "govuk-once/govuk-mobile-ios-app@3813aa2a:Tests/.../test_light_rendersCorrectly@3x.png" \
  src/components/divider/reference/ios-licence-category.webp --crop 0,600,1206,400
```

`find` lists snapshot images whose path has all the words given, at the head of `main` (or `--ref`), light ones unless `--dark`. `fetch` copies one, at the commit `find` printed, as WebP, cropped if asked, and prints what to put in `references[].from`. To choose a crop, fetch it whole first, look at it with the Read tool, and then fetch it again cropped to the part that shows the component: iOS images are 3x, so a 390pt-wide phone is 1170 pixels.

Name each `reference/<platform>-<what>.webp`, and list it in the definition's `references`, with `platform`, a `description` of what it shows, and `from`, the test.

A small component, such as a divider, rarely has a test of its own, so `find <its name>` finds nothing. Search where it's used (`gh search code ... "ListDivider("`), then `find` that screen's name (`find licencecategory`), and crop the screen to the part that shows it. If no snapshot shows it, say so in the `.md`, and build from the code alone.

The iOS app keeps its snapshots in Git LFS: `fetch` handles that. Reading one any other way gets a few lines of text pointing at it, not the image.

## A proposed component

One that isn't in the app yet comes from a design.

- **A Figma link**: if the Figma tools are available (find them with ToolSearch, `figma`), use `get_design_context` for its sizes, colours and fonts, and `get_screenshot` to see it. A Figma URL's `node-id=1-2` is the node `1:2`. Put the link in `sources.figma`, with a `title` saying what it is.
- **Screenshots only**: ask the person for the file, copy it into `reference/` (as WebP if it's large; `reference.js` takes a local PNG only through GitHub, so a PNG file is fine as it is), and measure from it, saying in `origin.notes` and the `.md` that the sizes are approximate, as `status` does.

Either way, `proposed.design` says where the design came from. If the design has no dark mode, choose dark colours from the app's tokens, and list that under "Known differences from the designs".
