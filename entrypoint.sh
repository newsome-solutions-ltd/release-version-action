#!/bin/sh
if [ "${VERSION_SCHEMES}" != "" ]; then
    versionSchemes=${VERSION_SCHEMES}
else
    versionScheme=${VERSION_SCHEME}
fi

tagPrefix=${TAG_PREFIX}
placeholderChars=${PLACEHOLDER_CHARS}
workingDir=$(pwd)
format=${FORMAT}

nextVersionFile=/tmp/nextVersions
if [ "${format}" != "" ]; then
    nextVersionFile = "${nextVersionFile}.${format}"
fi

echo "Working directory is [${workingDir}], with contents:"
ls -la ${workingDir}

git config --global --add safe.directory ${workingDir}
echo "[Git config] Working directory marked as safe directory"

node /app/src/main/js/index.js -t "${tagPrefix}" -s "${versionSchemes}" -p "${placeholderChars}" -d "${workingDir}"

nextVersionValues=$(cat "${nextVersionFile}")

echo "Next version is [$nextVersionValues] available at ${nextVersionFile}"
echo "nextVersion=$nextVersionValues" >> $GITHUB_OUTPUT
