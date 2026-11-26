#!/bin/sh
# Installs the latest long-term support version of Node.js into the person's
# own home folder, from nodejs.org, so it needs no administrator password and
# no developer tools. A Mac only. Prints where node is when it's done.
#
#   sh install-node.sh
#
# Then use it with PATH="$HOME/.local/node/bin:$PATH". INSTALL_DIR puts it
# somewhere other than ~/.local, to try it out.

set -eu

case "$(uname -s)-$(uname -m)" in
  Darwin-arm64) platform=darwin-arm64 ;;
  Darwin-x86_64) platform=darwin-x64 ;;
  *) echo "This only installs Node.js on a Mac." >&2; exit 1 ;;
esac

# The newest version marked as long-term support in Node.js's own list.
index=$(curl -fsSL https://nodejs.org/dist/index.tab)
version=$(printf '%s\n' "$index" | awk -F'\t' 'NR > 1 && $10 != "-" { print $1; exit }')
[ -n "$version" ] || { echo "Couldn't read the list of Node.js versions from nodejs.org." >&2; exit 1; }

name="node-$version-$platform"
dir="${INSTALL_DIR:-$HOME/.local}"
mkdir -p "$dir"
cd "$dir"

curl -fsSLO "https://nodejs.org/dist/$version/$name.tar.gz"
# Checked against the checksums nodejs.org publishes, so a broken or altered
# download is never used.
curl -fsSL "https://nodejs.org/dist/$version/SHASUMS256.txt" | grep " $name.tar.gz\$" | shasum -a 256 -c - > /dev/null
tar -xzf "$name.tar.gz"
rm "$name.tar.gz"

# ~/.local/node is always the latest installed, so PATH never changes.
ln -sfn "$dir/$name" "$dir/node"
echo "$dir/node/bin/node $("$dir/node/bin/node" --version)"
