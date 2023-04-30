#!/usr/bin/env bash

set -x

docker run --interactive --tty \
    --volume ./packages/kindle-vocab-api/test/:/test \
    --volume ./test-out/:/out \
    node:latest \
    npx --yes @ekamil/kindle-vocab-cli \
    --database /test/vocab.db \
    --output /out
