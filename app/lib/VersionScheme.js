
const loggerFactory = require("./LoggerFactory");

const log = loggerFactory.createLogger();

// --------------------------------------------------------------- Classes

function escapeRegExp(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

class VersionScheme {
    constructor(scheme, placeholder) {
        this.scheme = scheme;
        this.placeholder = placeholder;

        const indexOfPlaceholder = this.scheme.indexOf(placeholder);
        if (indexOfPlaceholder < 0) {
            throw {'message': `Placeholder ${placeholder} is not found within version scheme pattern ${scheme}`};
        }
        this.searchPattern = this.scheme.substring(0, indexOfPlaceholder) + '*' + this.scheme.substring(indexOfPlaceholder + this.placeholder.length);
        this.regex = new RegExp(escapeRegExp(this.scheme.substring(0, indexOfPlaceholder)) + "(\\d+)" + escapeRegExp(this.scheme.substring(indexOfPlaceholder + this.placeholder.length)))
        log.debug(`Version scheme created [scheme: ${this.scheme}] [placeholder: ${this.placeholder}] [search pattern: ${this.searchPattern}] [regex: ${this.regex}]`);
    }

    getGitSearchPattern = () => {
        return this.searchPattern;
    }

    nextVersion = (previousVersions) => {
        const maxVersion = this._findMaxVersion(previousVersions);
        const nextVersion = (maxVersion) ? maxVersion + 1 : 1;
        return this.searchPattern.replace('*', nextVersion);
    }

    _findMaxVersion = (versionArray) => {
        return versionArray
            .filter(e => this.regex.test(e)) 
            .map((e) => {const match = e.match(this.regex); return match[1]})
            .map(e => parseInt(e))
            .sort(function(a, b) {
                return b - a;
            })
            .at(0);
    }
}

module.exports = VersionScheme;
