#!/bin/sh
if [ "${VERSION_SCHEMES}" != "" ]; then
    versionSchemes=${VERSION_SCHEMES}
else
    versionScheme=${VERSION_SCHEME}
fi
nextVersionFilePlain=/tmp/nextVersions
if [ "${FORMAT}" != "" ]; then
    nextVersionFile="/tmp/nextVersions.${FORMAT}"
else
    nextVersionFile=$nextVersionFilePlain
fi

tagPrefix=${TAG_PREFIX}
placeholderChars=${PLACEHOLDER_CHARS}
workingDir=$(pwd)

echo "Working directory is [${workingDir}], with contents:"
ls -la ${workingDir}

git config --global --add safe.directory ${workingDir}
echo "[Git config] Working directory marked as safe directory"

node /app/src/main/js/index.js -t "${tagPrefix}" -s "${versionSchemes}" -p "${placeholderChars}" -d "${workingDir}"

nextVersionValues=$(cat "${nextVersionFile}")

echo "Next versions are \"$nextVersionValues\", read from ${nextVersionFile}"
echo "nextVersions=$nextVersionValues" >> $GITHUB_OUTPUT
# following line maintains backwards compatability
echo "nextVersion=$(cat $nextVersionFilePlain)" >> $GITHUB_OUTPUT
