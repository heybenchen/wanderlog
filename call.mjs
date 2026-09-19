// Usage: node --env-file=.env call.mjs schemas
//        node --env-file=.env call.mjs <calls.json>   (array of {tool, args}; "$KEY" in string args is replaced by the trip key)
import fs from "node:fs";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const [file, key = ""] = process.argv.slice(2);
const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["node_modules/wanderlog-mcp/dist/index.js"],
  env: { ...process.env },
  stderr: "ignore",
});
const client = new Client({ name: "call", version: "0.0.0" });
await client.connect(transport);
const calls = JSON.parse(fs.readFileSync(file, "utf8"));
for (const { tool, args } of calls) {
  const a = JSON.parse(JSON.stringify(args ?? {}).replaceAll("$KEY", key));
  const r = await client.callTool({ name: tool, arguments: a });
  const label = a.place ?? a.hotel ?? a.day ?? a.title ?? a.text?.slice(0, 40) ?? "";
  console.log(`${r.isError ? "ERR" : "ok "} ${tool} ${label}`);
  for (const c of r.content) if (r.isError || tool === "wanderlog_create_trip" || tool === "wanderlog_search_places" || tool === "wanderlog_get_trip_url" || tool === "wanderlog_get_trip") console.log("   ", c.text);
}
await client.close();
