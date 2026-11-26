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
 * The latest release, as { tag, version, url }. Asks GitHub without signing
 * in, which it allows 60 times an hour from one network. Throws an error
 * whose message can be shown to anyone.
 */
export async function latestRelease() {
  let response
  try {
    response = await fetch(api, {
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
  const release = await response.json()
  const version = parseVersion(release.tag_name)
  if (!version) throw new Error(`The latest release of the components, ${release.tag_name}, isn’t a version this understands.`)
  const hasAsset = (release.assets ?? []).some(asset => asset.name === assetName)
  return { tag: release.tag_name, version, url: downloadUrl(release.tag_name, hasAsset) }
}
