# Release-Version-Action

This action auto-determines the next release version for a Git repository, given the following information:
* A version *scheme* pattern - see below for more information on schemes
* A Git tag prefix - this is the set of characters preceding the *version* for version related tags for the repository. By default this would be `'v'`.
* Version scheme placeholder characters - a character (or string) within the version *scheme* which is replaced with an incrementing number.
* List of existing tags within the repository.

This action does NOT tag the repository with the next tag version, it only determines the next version, given an existing set of tags satisfying a known version scheme.

## Version Schemes

A version scheme represents a series of sequential versions of an releasable artifact, and is expressed as a string pattern value.
For example, the pattern `"1.x.0"` represents all versions from `1.0.0`, `1.1.0`, `1.2.0`, ...

The placeholder character of `'x'` can be modified to any series of characters, for example `"VER"` or `"-??-"`.

The scheme can consist of the following characters: `alphanumeric` (A-Z,a-z,0-9) and `_-#.$:;,@`.

A special note about the initial version for a scheme. In an attempt to support any valid version scheme, the initial number replacing the placeholder character(s) will be `0` unless the characters are preceded by zero segments (`'0.'`) or a non-numeric prefix or otherwise have no prefix, in which case it will be `1`. The following table attempts to clarify:

| scheme  | initial version |
| ------- | --------------- |
| x       | 1               |
| 0.0.x   | 0.0.1           |
| 0.x.0   | 0.1.0           |
| x.0.0   | 1.0.0           |
| 1.x.0   | 1.0.0           |
| ABC.x.0 | ABC.1.0         |
| ABC.0.x | ABC.0.1         |
| ABC1.0.x | ABC1.0.0       |
| ABC15.x | ABC15.0         |


## How it works

Given a version scheme expression, this action will read the latest tags using the following git command:
```shell
git tag -l --sort=-version:refname "${pattern}"
```
where `${pattern}` represents the scheme expression where the placeholder character(s) are replace with an asterix.
For example, where the version scheme is `1.x.0`, the search pattern will be `1.*.0`.

The action checks all matching tags and assesses the maximum numeric value for the placeholder. The next version is then this value + 1.

Example:
For a version scheme with expression `1.x.0`, and where the repository has the following tags:
`v1.0.0`, `v1.0.1` and `v1.1.0`, then the next version would be considered to be **`1.2.0`**.

If in the above scenario, a user was to add a tag which does not conform to the expected format (e.g. `v1.A.0`), then this will be ignored.

## Usage

See [action.yml](action.yml)

Example with the default input values:

```yaml
steps:
    ...
    - name: Determine next version number
      id: determine-next-value
      uses: newsome-solutions-ltd/release-version-action@v2
      with:
        versionScheme: '0.0.x'
        tagPrefix: 'v'
        placeholderChars: 'x'
        workingDirectory: '.'
```
The next version value can be retrieved using the expression:
```yaml
${{ steps.determine-next-value.outputs.nextVersion }}
```

