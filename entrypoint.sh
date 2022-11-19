#!/bin/sh
versionScheme=${VERSION_SCHEME}
tagPrefix=${TAG_PREFIX}
placeholderChars=${PLACEHOLDER_CHARS}
workingDir=$(pwd)

nextVersionFile=/tmp/nextVersion

echo "Working directory is [${workingDir}], with contents:"
ls -la ${workingDir}

git config --global --add safe.directory ${workingDir}
echo "[Git config] Working directory marked as safe directory"

node /app/index.js -t "${tagPrefix}" -s "${versionScheme}" -p "${placeholderChars}" -d "${workingDir}"

nextVersionValue=$(cat "${nextVersionFile}")

echo "Next version is [$nextVersionValue] available at ${nextVersionFile}"
echo "nextVersion=$nextVersionValue" >> $GITHUB_OUTPUT
