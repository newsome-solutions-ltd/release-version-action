#! /usr/bin/env node

// --------------------------------------------------------------- Imports

const fs = require('fs');
const { execSync } = require("child_process");
const GitRepository = require("../../main/js/GitRepository");
const loggerFactory = require("../../main/js/LoggerFactory");

// ------------------------------------------------------------- Variables 

const dir = './.test/repository';
const log = loggerFactory.createLogger();

// ------------------------------------------------------ Global functions 

function createGitRepository(directory) {
    ensureDirExists(directory);
    var repo = new GitRepository(directory);
    repo.init();
    return repo;
}

function ensureDirExists(directory) {
    if (!fs.existsSync(directory)){
        log.debug(`Creating temporary repository directory at [${directory}]`);
        fs.mkdirSync(directory, { recursive: true });
    }
}

function setupGitDefaults() {
    execSync("git config --global init.defaultBranch main");
    execSync("git config --global user.email \"test@test.com\"");
    execSync("git config --global user.name \"Test User\"");
}

function deleteDirectory(directory) {
    fs.rmSync(directory, { recursive: true, force: true });
}

beforeEach(() => {
    deleteDirectory(dir);
    setupGitDefaults();
});

function run(args) {
    const output = execSync("node . " + args).toString();
    log.debug('output: ' + output);
}

function assertNextVersion(expectedVersion) {
    const data = fs.readFileSync("/tmp/nextVersion").toString();
    expect(data).toBe(expectedVersion);
}

// ----------------------------------------------------------------- tests

test('should calculate next version for repository with default values', () => {
    createGitRepository(dir);

    // this runs the main index.js script, with the defaults
    run(`-d "${dir}"`);
    assertNextVersion("0.0.1");
});

test('should reject version scheme with asterix character', () => {
    createGitRepository(dir);

    expect(() => run(`-s "1.*.x" -d "${dir}"`)).toThrow();
});

test('should calculate next version with single number in scheme', () => {
    createGitRepository(dir);

    run(`-s "x" -d "${dir}"`);
    assertNextVersion("1");
});

test('should calculate next version where initial value is zero', () => {
    createGitRepository(dir);
    
    run(`-s "1.x.0" -d "${dir}"`);
    assertNextVersion("1.0.0");
});

test('should calculate next version for repository with simple scheme', () => {
    const repository = createGitRepository(dir);
    repository.writeFile("README.md", "# initial commit");
    repository.stageAndCommit("Initial commit");
    repository.tag("1")

    run(`-t "" -s "#" -p "#" -d "${dir}"`);
    assertNextVersion("2");
});

test('should calculate next version for repository with multiple tags', () => {
    const repository = createGitRepository(dir);
    repository.writeFile("README.md", "# initial commit");
    repository.stageAndCommit("Initial commit");
    repository.tag("v0.0.1")
    repository.writeFile("README2.md", "# second commit");
    repository.stageAndCommit("Second commit");
    repository.tag("v0.0.2")
    repository.tag("vtest")

    // this runs the main index.js script...
    run(`-t v -s 0.0.x -p x -d "${dir}"`);
    assertNextVersion("0.0.3");
});


test('should calculate next version for repository with custom scheme', () => {
    const repository = createGitRepository(dir);
    repository.writeFile("README.md", "# initial commit");
    repository.stageAndCommit("Initial commit");
    repository.tag("VERabc.1SUF");
    repository.writeFile("README2.md", "# second commit");
    repository.stageAndCommit("Second commit");
    repository.tag("VERabc.10SUF")
    repository.tag("VEROTHERSUF")

    // this runs the main index.js script...
    run(`-t VER -s "abc.ABCSUF" -p ABC -d "${dir}"`);
    assertNextVersion("abc.11SUF");
});
