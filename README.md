# wanderlog

Template project wired to [wanderlog-mcp](https://www.npmjs.com/package/wanderlog-mcp), an MCP server for building Wanderlog trip itineraries with Claude.

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and set `WANDERLOG_COOKIE` to your `connect.sid` value
   (wanderlog.com > DevTools > Application > Cookies). Treat it like a password.
3. `npm run verify` starts the server over stdio, lists its tools, and (with a cookie) calls `wanderlog_list_trips`.
4. Claude Code picks up `.mcp.json` automatically; it reads `WANDERLOG_COOKIE` from your environment.
