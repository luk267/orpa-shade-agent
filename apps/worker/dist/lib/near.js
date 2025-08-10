import { providers } from "near-api-js";
export function rpc(endpoint = process.env.NEAR_RPC ?? "https://rpc.mainnet.near.org") {
    return new providers.JsonRpcProvider({ url: endpoint });
}
export async function fetchTx(txHash, accountId) {
    // Near RPC expects base64 tx hash? nope—use `tx` method with [hash, account_id]
    // near-api-js provider provides `txStatus` for backward compat.
    const provider = rpc();
    return provider.txStatus(txHash, accountId);
}
