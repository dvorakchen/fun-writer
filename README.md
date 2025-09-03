# Fun Writer

AI Fun Novel Generator

# Usage

set .env file
```
# database url of PostgreSQL
DATABASE_URL=postgres://username:password@localhost:5432/database
SERVER_PRIVATE_KEY=<private key for JWT>
OPENAI_KEY=<openai key>
OPENAI_BASEURL=<openai base url, e.g. https://api.deepseek.com>
```

## Dev

```sh
bun --bun dev --open
```

## Test

run the `unit test` and `component test`

The `Component Test` should run in the client mode, the test file should named `<***>.svelte.{spec,test}.{ts,js}`.

The `Unit Test` should run in the node mode, the test file should named `<***>.{spec,test}.{ts,js}`.

```sh
bun run test
```

## Build

```sh
bun --bun run build
# output build/
# migrate database, you need to set the environment variable `DATABASE_URL` first,
# just set the .env file at the root of project
bunx node-pg-migrate up

bun ./build/index.js
```

## Deploy with podman

```sh
bash ./pod_startup.sh
```

## Database Migration

**NOTI: PostgreSQL only!**

the migration tool using node-pg-migrate, see the [document](https://salsita.github.io/node-pg-migrate/getting-started).

setting the environment variable DATABASE_URL.

```
# .env
DATABASE_URL=postgres://postgres@localhost/database
```

create migration file:

```sh
bun migrate:create <migration_name> -j ts
```

edit your migration file and run:

```sh
bun migrate:up
```

to apply the migartion
