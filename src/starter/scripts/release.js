// The GOV.UK app prototype components' releases on GitHub: which is the
// latest, and where to download it from. A plain download, so installing
// needs neither git nor a GitHub account.

export const repository = 'alphagov/govuk-mobile-prototype-components'

// The release workflow attaches the package to each release under this name:
// what npm pack makes, so only what the package ships.
export const assetName = 'govuk-mobile-prototype-components.tgz'

// GitHub's list of releases, unless a test points elsewhere.
const api = process.env.GOVUK_APP_RELEASES_API ?? `https://api.github.com/repos/${repository}/releases/latest`

/** A version's three numbers, from v1.2.3 or 1.2.3, or nothing. */
export function parseVersion(text) {
  const match = String(text).match(/^v?(\d+)\.(\d+)\.(\d+)$/)
  return match ? match.slice(1).map(Number) : null
}

/** Below zero if a is older than b, above if newer. */
export function compareVersions(a, b) {
  return a[0] - b[0] || a[1] - b[1] || a[2] - b[2]
}

/** Where to download a release: its package, or, if it has none, its source. */
export function downloadUrl(tag, hasAsset = true) {
  return hasAsset
    ? `https://github.com/${repository}/releases/download/${tag}/${assetName}`
    : `https://github.com/${repository}/archive/refs/tags/${tag}.tar.gz`
}

/**
 * GitHub's answer to one question, as JSON. Asks without signing in, which
 * GitHub allows 60 times an hour from one network. Throws an error whose
 * message can be shown to anyone.
 */
async function ask(url) {
  let response
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'govuk-app-prototype' },
      signal: AbortSignal.timeout(15000)
    })
  } catch {
    throw new Error('Couldn’t reach GitHub to find the latest version of the components. Check the internet connection, and try again.')
  }
  if (response.status === 403 || response.status === 429) {
    throw new Error('GitHub is limiting how often this network can ask for the latest version of the components. Try again in an hour, or on another network.')
  }
  if (response.status === 404) {
    throw new Error('The GOV.UK app components haven’t been released yet, so there’s no version to make a prototype from.')
  }
  if (!response.ok) {
    throw new Error(`GitHub didn’t say what the latest version of the components is (it answered ${response.status}). Try again in a few minutes.`)
  }
  return response.json()
}

/** The latest release, as { tag, version, url }. */
export async function latestRelease() {
  const release = await ask(api)
  const version = parseVersion(release.tag_name)
  if (!version) throw new Error(`The latest release of the components, ${release.tag_name}, isn’t a version this understands.`)
  // The address GitHub gives for the package, which is downloadUrl's, or a
  // test's stand-in's.
  const asset = (release.assets ?? []).find(asset => asset.name === assetName)
  return { tag: release.tag_name, version, url: asset?.browser_download_url ?? downloadUrl(release.tag_name, Boolean(asset)) }
}

/**
 * The releases newer than `version` (three numbers), oldest first, each as
 * { tag, version, date, notes }. A release's notes list the pull requests
 * merged since the one before, as the release workflow writes them.
 */
export async function releasesSince(version) {
  // The list is beside the latest, at GitHub and at a test's stand-in.
  const list = await ask(`${api.replace(/\/latest$/, '')}?per_page=100`)
  return list
    .filter(release => !release.draft && !release.prerelease)
    .map(release => ({
      tag: release.tag_name,
      version: parseVersion(release.tag_name),
      date: release.published_at?.slice(0, 10),
      notes: release.body ?? ''
    }))
    .filter(release => release.version && compareVersions(release.version, version) > 0)
    .sort((a, b) => compareVersions(a.version, b.version))
}

/** The version a release's download address is of, such as package.json has, or nothing. */
export function versionOf(address) {
  const tag = String(address ?? '').match(/\/(?:releases\/download|archive\/refs\/tags)\/(v?\d+\.\d+\.\d+)[/.]/)?.[1]
  return tag ? parseVersion(tag) : null
}
