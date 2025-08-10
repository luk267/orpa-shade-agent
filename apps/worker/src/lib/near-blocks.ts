import { providers } from "near-api-js";
import { rpc } from "./near.js";

export type NearBlockHeader = {
  height: number;
  hash: string;
  timestamp: number; // ns
  chunks: { chunk_hash: string }[];
};

export async function getFinalBlock() {
  const provider = rpc();
  const res = await provider.block({ finality: "final" });
  return normalizeBlock(res);
}

export async function getBlockByHeight(height: number) {
  const provider = rpc();
  const res = await provider.block({ blockId: height });
  return normalizeBlock(res);
}

function normalizeBlock(res: any): NearBlockHeader {
  return {
    height: res.header.height,
    hash: res.header.hash,
    timestamp: Number(res.header.timestamp), // ns
    chunks: res.chunks.map((c: any) => ({ chunk_hash: c.chunk_hash })),
  };
}

export async function getChunkTransactions(chunkHash: string) {
  const provider = rpc();
  const chunk = await provider.chunk(chunkHash);
  // `transactions` array: { signer_id, receiver_id, hash, ... }
  return chunk.transactions ?? [];
}
