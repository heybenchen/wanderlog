# wanderlog

Project wired to [wanderlog-mcp](https://www.npmjs.com/package/wanderlog-mcp), an MCP server for building Wanderlog trip itineraries with Claude.

## Layout

```
.
├── .mcp.json          registers the wanderlog MCP server for Claude Code
├── .env.example       copy to .env and add your cookie (.env is gitignored)
├── package.json       dependency on wanderlog-mcp, `npm run verify`
├── scripts/           shared tooling that works for any trip
│   ├── verify.mjs     starts the MCP server and lists its tools
│   └── call.mjs       runs a JSON list of MCP tool calls against a trip
└── korea/             one folder per trip (see korea/README.md)
    ├── pins.json
    └── rebuild.mjs
```

Add a new trip as its own top-level folder (for example `japan/`), and put anything reusable across trips in `scripts/`.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and set `WANDERLOG_COOKIE` to your `connect.sid` value
   (wanderlog.com > DevTools > Application > Cookies). Treat it like a password.
3. `npm run verify` starts the server over stdio, lists its tools, and (with a cookie) calls `wanderlog_list_trips`.
4. Claude Code picks up `.mcp.json` automatically; it reads `WANDERLOG_COOKIE` from your environment.

## Running scripts

Run everything from the repo root so `.env` is found:

```bash
node --env-file=.env scripts/call.mjs path/to/calls.json <tripKey>
```
