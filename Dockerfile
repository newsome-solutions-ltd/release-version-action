FROM node:18.12.1-alpine3.16 AS builder

ENV TAG_PREFIX='v'
ENV VERSION_SCHEME='0.0.x'
ENV PLACEHOLDER_CHARS='x'

# Install git
RUN apk update && \
    apk --no-cache add git

FROM builder

RUN mkdir -p /app/

COPY app/ /app/

RUN chmod 755 -R /app && \
    chown root:root -R /app && \
    cd /app && npm install

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod 750 /app/entrypoint.sh

ENTRYPOINT "/app/entrypoint.sh"
