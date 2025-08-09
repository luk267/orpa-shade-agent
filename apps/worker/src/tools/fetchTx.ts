import { z } from "zod";
import { fetchTx } from "../lib/near.js";

export const FetchTxSchema = z.object({
  txHash: z.string(),
  accountId: z.string()
});

export async function fetchTxTool(input: unknown) {
  const { txHash, accountId } = FetchTxSchema.parse(input);
  const res = await fetchTx(txHash, accountId);
  // Normalize for logging
  return {
    hash: res.transaction?.hash ?? txHash,
    signer_id: res.transaction?.signer_id,
    receiver_id: res.transaction?.receiver_id,
    status: typeof res.status === "string" ? res.status : Object.keys(res.status)[0],
    receipt_count: Array.isArray(res.receipts_outcome) ? res.receipts_outcome.length : 0,
  };
}
