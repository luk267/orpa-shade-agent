import { fetchTxTool } from "./tools/fetchTx.js";

async function main() {
  const [,, txHash, accountId] = process.argv;
  if (!txHash || !accountId) {
    console.error("Usage: node dist/index.js <txHash> <accountId>");
    process.exit(1);
  }
  const out = await fetchTxTool({ txHash, accountId });
  console.log(JSON.stringify(out, null, 2));
}
main().catch(e => { console.error(e); process.exit(1); });
