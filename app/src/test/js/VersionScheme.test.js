#! /usr/bin/env node

// --------------------------------------------------------------- Imports

const VersionScheme = require("../../main/js/VersionScheme");

function versionScheme(expression, placeholder) {
    return new VersionScheme(expression, placeholder ? placeholder : 'x');
}

// ----------------------------------------------------------------- Tests


describe('VersionScheme', () => {

    // Test that it determines the correct INITIAL version (no existing versions)

    it.each`
    scheme              | initialVersion
    ${'x'}              | ${'1'}
    ${'x.0'}            | ${'1.0'}
    ${'x.0.0'}          | ${'1.0.0'}
    ${'x.0.0'}          | ${'1.0.0'}
    ${'0.x.0'}          | ${'0.1.0'}
    ${'0.x.1'}          | ${'0.1.1'}
    ${'1.x.0'}          | ${'1.0.0'}
    ${'A.x'}            | ${'A.1'}
    ${'REL:x-beta'}     | ${'REL:1-beta'}
    ${'REL:1.x-beta'}   | ${'REL:1.0-beta'}
    ${'REL:0.x-beta'}   | ${'REL:0.1-beta'}
    ${'ABC.x.0'}        | ${'ABC.1.0'}
    ${'ABC.0.x'}        | ${'ABC.0.1'}
    ${'ABC1.0.x'}       | ${'ABC1.0.0'}
    ${'ABC15.x'}        | ${'ABC15.0'}
    ${'(x)-alpha'}      | ${'(1)-alpha'}
    ${'{x}-alpha'}      | ${'{1}-alpha'}
    ${'[x]-alpha'}      | ${'[1]-alpha'}
    ${'x_#1-@build'}    | ${'1_#1-@build'}
    ${'x_$10:@build;test'} | ${'1_$10:@build;test'}
    `("should determine initial version", async ({ scheme, initialVersion }) => {
        let s = versionScheme(scheme);
        expect(s.nextVersion([]), `Unexpected initial version for scheme "${scheme}"`).toBe(initialVersion);
    });


    // Test that it determines the correct NEXT version (with natural sequence of existing versions)

    it.each`
    scheme              | tags                              | nextVersion
    ${'x'}              | ${'0,1,3'}                        | ${'4'}
    ${'x.0'}            | ${'1.0,2.0,3.0'}                  | ${'4.0'}
    ${'x.0.0'}          | ${'0.0.1'}                        | ${'1.0.0'}
    ${'x.0.0'}          | ${'1.0.0,1.0.1,2.0.0'}            | ${'3.0.0'}
    ${'1.x.0'}          | ${'1.0.0,1.0.1,1.1.0,1.A.0'}      | ${'1.2.0'}
    ${'REL:x-beta'}     | ${'REL:1-beta,REL:2-beta'}        | ${'REL:3-beta'}
    ${'REL:1.x-beta'}   | ${'REL:1.0-beta,REL:1.1-beta'}    | ${'REL:1.2-beta'}    
    ${'REL:0.x-beta'}   | ${'REL:0.1-beta,REL:0.2-beta'}    | ${'REL:0.3-beta'}
    ${'ABC.x.0'}        | ${'ABC.1.0,ABC.2.0,ABC.3.0'}      | ${'ABC.4.0'}
    ${'ABC.0.x'}        | ${'ABC.0.1,ABC.0.2'}              | ${'ABC.0.3'}    
    ${'ABC1.0.x'}       | ${'ABC1.0.0,ABC1.0.1,ABC1.0.2'}   | ${'ABC1.0.3'}
    ${'ABC15.x'}        | ${'ABC15.0,ABC15.1,ABC15.2'}      | ${'ABC15.3'}
    `("should determine next version", async ({ scheme, tags, nextVersion }) => {
        let s = versionScheme(scheme);
        expect(s.nextVersion(tags.split(','))).toBe(nextVersion);
    });

    // Test that it ignores existing versions not conforming to the scheme

    it.each`
    scheme              | tags                              | nextVersion
    ${'x'}              | ${'A,1.0,v1'}                     | ${'1'}
    ${'x.0'}            | ${'A.0,1.0.0,1.1,v1.0'}           | ${'1.0'}
    ${'x.0.0'}          | ${'v0.0.1,A.B.C,A.0.0,0.0.1'}     | ${'1.0.0'}
    ${'1.x.0'}          | ${'v1.0.0,1.0.1,2.1.0,1.A.0'}     | ${'1.0.0'}
    ${'ABC.x.0'}        | ${'ABC1.0,ABC.2.0-s,ABC.1'}       | ${'ABC.1.0'}
    ${'ABC.0.x'}        | ${'ABC.1.0,ABC.A.0,ABC.0.A'}      | ${'ABC.0.1'}
    ${'ABC.1.x'}        | ${'ABC.0.1,ABC.A.0,ABC.1.A'}      | ${'ABC.1.0'}
    `("should ignore existing versions not conforming to the scheme", async ({ scheme, tags, nextVersion }) => {
        let s = versionScheme(scheme);
        expect(s.nextVersion(tags.split(','))).toBe(nextVersion);
    });

    // Test that it should reject invalid schemes (non-exhastive -- too many characters to test)

    it.each`
    scheme
    ${'!x'}
    ${'/x'}
    ${'~x'}
    ${'*x'}
    ${'&x'}
    ${'%x'}
    ${'"x'}
    ${'^x'}
    ${'?x'}
    ${'<x'}
    ${'>x'}
    `("should reject invalid schemes", async ({ scheme }) => {
        expect(() => new VersionScheme(scheme, 'x')).toThrow({'message': `Scheme [${scheme}] is invalid`});
    });
});