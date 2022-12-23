#! /usr/bin/env node
'use strict'

const fs = require('fs');
const yargs = require("yargs");
const GitRepository = require("./GitRepository");
const loggerFactory = require("./LoggerFactory");
const VersionScheme = require("./VersionScheme");

const log = loggerFactory.createLogger();

log.info("######################################################");
log.info("# Release Version GitHub Action                      #");
log.info("######################################################");

// ----------------------------------------------------- arguments

const options = yargs
 .usage("Usage: [-t <tag prefix> -s <scheme> -p <placholder> -d <workdir>]")
 .option("t", { alias: "tag", describe: "Tag prefix, defaults to 'v'", type: "string", demandOption: false, default: 'v' })
 .option("s", { alias: "schemes", describe: "Version schemes pattern, see documentation for details", type: "string", demandOption: false })
 .option("p", { alias: "placeholder", describe: "Version scheme pattern placeholder for the number to increment", type: "string", demandOption: false, default: 'x' })
 .option("d", { alias: "workdir", description: "Working directory, defaults to current dir.", demandOption: false, default: "."})
 .argv;

// ----------------------------------------------------- functions

function toVersionScheme(str) {
    return new VersionScheme(str, options.placeholder);
}

function nextVersionOf(versionScheme /*VersionScheme*/) {
    if (versionScheme.isStatic()) {
        log.debug(`Next version for static scheme is ${versionScheme.scheme}`);
        return versionScheme.scheme;
    }
    const repo = new GitRepository(options.workdir);
    const tags = repo.getTags({pattern: options.tag + versionScheme.getGitSearchPattern()});
    log.info(`Existing tags: [${tags}]`);
    const previousVersions = tags.map(e => e.substring(options.tag.length));
    const nextVersion = versionScheme.nextVersion(previousVersions);
    log.debug(`Next version for scheme [${versionScheme.scheme}] is ${nextVersion}`);
    return nextVersion;
}

function quote(str) {
    return `'${str}'`
}

function toJsonStr(strs) {
    if (strs.length == 1) {
        return quote(strs[0]);
    }
    return '[' + nextVersions.map(quote) + ']';
}

function toPlainStr(strs) {
    return strs.toString();
}

// ---------------------------------------------------------- main

const schemeStr = (options.schemes) ? options.schemes : `0.0.${options.placeholder}`
const schemeStrs = schemeStr.split(/\s*,\s*/);
log.info(`Version schemes from string [${schemeStr}] =  ${schemeStrs.toString()}, count = ${schemeStrs.length}`);

const greeting = `Invoking action with parameters [tag prefix: ${options.tag}, scheme: ${schemeStr}, placeholder: ${options.placeholder}, workdir: ${options.workdir}]`;

log.info(greeting);

const versionSchemes = schemeStrs.map(toVersionScheme);

const nextVersions = versionSchemes.map(nextVersionOf)

fs.writeFileSync("/tmp/nextVersions", toPlainStr(nextVersions));
fs.writeFileSync("/tmp/nextVersions.json", toJsonStr(nextVersions));
