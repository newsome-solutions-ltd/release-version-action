
const loggerFactory = require("./LoggerFactory");

const log = loggerFactory.createLogger();
const symbolSet = '_-#.$:;,@(){}[]';
const escapedSymbolSet = `${escapeRegExp(symbolSet)}`;
const validRegex = new RegExp(`^[A-Za-z0-9${escapedSymbolSet}]+$`);
const zeroSegmentRegex = new RegExp(`^[${escapedSymbolSet}]*(0[${escapedSymbolSet}]+)+$`);
const numericSegmentRegex = new RegExp("^.*(\\d["+escapedSymbolSet+"]+)+$");

// --------------------------------------------------------------- Classes

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

class VersionScheme {
    constructor(scheme, placeholder) {
        log.debug(`Checking scheme against regex [${validRegex}]`);
        if (!validRegex.test(scheme)) {
            throw {'message': `Scheme [${scheme}] is invalid`};
        }

        this.scheme = scheme;
        this.placeholder = placeholder;

        const indexOfPlaceholder = this.scheme.indexOf(placeholder);
        if (indexOfPlaceholder < 0) {
            throw {'message': `Placeholder ${placeholder} is not found within version scheme pattern ${scheme}`};
        }
        this.prefix = this.scheme.substring(0, indexOfPlaceholder);
        this.suffix = this.scheme.substring(indexOfPlaceholder + this.placeholder.length);
        this.searchPattern = this.prefix + '*' + this.suffix;
        this.regex = new RegExp(`^${escapeRegExp(this.prefix)}(\\d+)${escapeRegExp(this.suffix)}$`)
        log.debug(`Version scheme created [scheme: ${this.scheme}] [placeholder: ${this.placeholder}] [search pattern: ${this.searchPattern}] [regex: ${this.regex}]`);
    }

    getGitSearchPattern = () => {
        return this.searchPattern;
    }

    nextVersion = (previousVersions) => {
        const maxVersion = this._findMaxVersion(previousVersions);
        const nextVersion = (maxVersion) ? maxVersion + 1 : this.initialVersion();
        return this.searchPattern.replace('*', nextVersion);
    }

    initialVersion = () => {
        let used = this._stripAlphaChars(this.prefix);
        log.debug("Checking usable version prefix: " + used);
        log.debug(`zeroSegmentRegex[${zeroSegmentRegex}].test() = ${zeroSegmentRegex.test(used)}`);
        log.debug(`numericSegmentRegex[${numericSegmentRegex}].test() = ${numericSegmentRegex.test(used)}`);
        if (used.length === 0) return 1;
        if (zeroSegmentRegex.test(used)) return 1;
        if (numericSegmentRegex.test(used)) return 0;
        return 1;
    }

    _findMaxVersion = (versionArray) => {

        versionArray.forEach(e => log.debug(`Does [${e}] Satisfy regex [${this.regex}]: ${this.regex.test(e)}`));

        return versionArray
            .filter(e => this.regex.test(e)) 
            .map((e) => { const match = e.match(this.regex); return match[1] })
            .map(e => parseInt(e))
            .sort(function(a, b) {
                return b - a;
            })
            .at(0);
    }

    _stripAlphaChars = (string) => {
        let result = string.replace(/[A-Za-z]+/g, '');
        if (result === string) return result
        return this._stripAlphaChars(result);
    }
}

module.exports = VersionScheme;
