# Developer Guide

This page includes details of how to run and test the action in a local development environment.

### Prerequisites

1. Docker
2. Node.js & NPM (optional)

### Building the Docker container

To build a local image, run the following command (from root of repository):
```
docker build -t ns/release-version-action:latest .
```


### Running the container (for testing the action code)

Run the local container as follows (from root of repository):
```
docker run -it --rm -v $(pwd):/workspace --entrypoint /bin/sh --workdir /workspace/app -u $(id -u ${USER}):$(id -g ${USER}) ns/release-version-action:latest
```
Installing the node modules and running the tests within the container:
```
/workspace/app $ npm install
/workspace/app $ npm test
```

### Running the container (for testing with a local repository)

To assess the next version (or initial version) for a Git repository using this function, the following command can be run:
```
cd $REPOSITORY_HOME
docker run -it --rm -v $(pwd):/workspace --workdir /workspace -e VERSION_SCHEME=1.x.0  ns/release-version-action:latest
```
The following environment variables can be set:

| variable          | description                                                                                      |
| ----------------- | ------------------------------------------------------------------------------------------------ | 
| VERSION_SCHEME    | The version scheme pattern expression. Default is '0.0.x'                                        |
| TAG_PREFIX        | Prefix to all Git repository version tags. Default is 'v'                                        |
| PLACEHOLDER_CHARS | The version scheme placeholder chars to be replaced with an incrementing number. Default is 'x'. |
