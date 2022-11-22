// --------------------------------------------------------------- Imports

const fs = require('fs');
const { execSync } = require("child_process");
const loggerFactory = require("./LoggerFactory");

const log = loggerFactory.createLogger();

// --------------------------------------------------------------- Classes

class GitRepository {
    constructor(directory) {
        this.directory = directory;
    }
    init = () => {
        execSync("git init", { cwd: this.directory });
        log.debug(`GitRepository: Git repository at [${this.directory}] has been initialized`);
    }
    writeFile = (filename, contents) => {
        log.debug(`GitRepository: Writing new file at [${filename}]`);
        fs.writeFileSync(this.directory + "/" + filename, contents)
    }
    stageAndCommit = (message) => {
        execSync("git add .", {cwd : this.directory});
        execSync(`git commit -m "${message}"`, {cwd : this.directory});
    }
    tag = (tagname) => {
        execSync(`git tag ${tagname}`, {cwd : this.directory});
    }
    log = () => {
        var output = execSync("git log", {cwd : this.directory});
        log.debug("Git log report:" + output);
    }
    getTags = (options) => {
        const pattern = (options.pattern) ? options.pattern : 'x';
        const output = execSync(`git tag -l --sort=-version:refname "${pattern}"`, {cwd : this.directory}).toString();
        log.debug(`Tags for pattern [${pattern}]:\n` + output);
        return (output.length > 0) ? output.split('\n').filter((e) => e && e.length > 0) : [];
    }
}

module.exports = GitRepository;