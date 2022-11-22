#! /usr/bin/env node
'use strict'

const fs = require('fs');
const yargs = require("yargs");
const GitRepository = require("./GitRepository");
const loggerFactory = require("./LoggerFactory");
const VersionScheme = require("./VersionScheme");

const log = loggerFactory.createLogger();

const options = yargs
 .usage("Usage: [-t <tag prefix> -s <scheme> -p <placholder> -d <workdir>]")
 .option("t", { alias: "tag", describe: "Tag prefix, defaults to 'v'", type: "string", demandOption: false, default: 'v' })
 .option("s", { alias: "scheme", describe: "Version scheme pattern, see documentation for details", type: "string", demandOption: false })
 .option("p", { alias: "placeholder", describe: "Version scheme pattern placeholder for the number to increment", type: "string", demandOption: false, default: 'x' })
 .option("d", { alias: "workdir", description: "Working directory, defaults to current dir.", demandOption: false, default: "."})
 .argv;

const schemeStr = (options.scheme) ? options.scheme : `0.0.${options.placeholder}`

const greeting = `Invoking action with parameters [tag prefix: ${options.tag}, scheme: ${schemeStr}, placeholder: ${options.placeholder}, workdir: ${options.workdir}]`;

log.debug(greeting);

const repo = new GitRepository(options.workdir);
const versionScheme = new VersionScheme(schemeStr, options.placeholder);
const tags = repo.getTags({pattern: options.tag + versionScheme.getGitSearchPattern()});
log.debug(`Existing tags: [${tags}]`);
const previousVersions = tags.map(e => e.substring(options.tag.length));
const nextVersion = versionScheme.nextVersion(previousVersions);
log.debug(`Next version is ${nextVersion}`)

fs.writeFileSync("/tmp/nextVersion", nextVersion);
