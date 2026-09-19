import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const cookie = process.env.WANDERLOG_COOKIE || "s%3Aplaceholder.invalid";
const transport = new StdioClientTransport({
  command: process.execPath,
  args: ["node_modules/wanderlog-mcp/dist/index.js"],
  env: { ...process.env, WANDERLOG_COOKIE: cookie },
  stderr: "inherit",
});
const client = new Client({ name: "verify", version: "0.0.0" });
await client.connect(transport);
const { tools } = await client.listTools();
console.log(`OK: ${tools.length} tools:`, tools.map((t) => t.name).join(", "));
if (process.env.WANDERLOG_COOKIE) {
  const r = await client.callTool({ name: "wanderlog_list_trips", arguments: {} });
  console.log("list_trips:", JSON.stringify(r.content).slice(0, 500));
} else {
  console.log("No WANDERLOG_COOKIE set: skipped live call.");
}
await client.close();

