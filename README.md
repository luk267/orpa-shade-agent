Project: ORPA — On-Chain Research & Protection Agent

One-liner: watches NEAR accounts/contracts, explains activity, and—under strict, on-chain guardrails—can prepare protective actions via Chain Signatures (testnets).

Docs followed:

Shade Agents intro / deploy. 
Security considerations. 
Chain Signatures getting started. 
NEAR AI Agents quickstart/integration. 

Getting started:

npm i && cp .env.example .env

npm run build && node dist/index.js <txHash> <accountId>

Roadmap (Week 1–4)

W1: RPC reads + template handshake

W2: custom agent contract + Chain Signatures path

W3: rules + LLM summaries

W4: TEE deploy + dashboard polish