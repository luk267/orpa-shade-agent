import "dotenv/config";
import { fetchTxTool } from "./tools/fetchTx.js";
import { scanRecentBlocks } from "./jobs/scanBlocks.js";
async function main() {
    const [, , cmdOrHash, arg2] = process.argv;
    if (!cmdOrHash) {
        console.error("Usage:\n  node dist/index.js <txHash> <accountId>\n  node dist/index.js scan <N>");
        process.exit(1);
    }
    if (cmdOrHash === "scan") {
        const n = Number(arg2 ?? "200");
        if (!Number.isFinite(n) || n <= 0) {
            console.error("Scan requires a positive number of blocks, e.g., `scan 500`");
            process.exit(1);
        }
        await scanRecentBlocks(n);
        return;
    }
    // D1 mode
    const txHash = cmdOrHash;
    const accountId = arg2;
    if (!accountId) {
        console.error("Missing accountId for tx lookup.");
        process.exit(1);
    }
    const out = await fetchTxTool({ txHash, accountId });
    console.log(JSON.stringify(out, null, 2));
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
