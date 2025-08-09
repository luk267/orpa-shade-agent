# ORPA Shade Agent Architecture

## Overview

ORPA Shade Agent is a decentralized TEE-based agent system running on the Shade Protocol network.

## Components

### Apps

#### Worker (`apps/worker/`)
- TEE worker implementation in TypeScript
- Handles agent computation and secure execution
- Interfaces with Shade Protocol contracts

#### Web (`apps/web/`)
- Status dashboard (Next.js)
- Monitoring and management interface
- Future implementation

### Contracts

#### ORPA Agent (`contracts/orpa_agent/`)
- Rust-based smart contract
- Scaffolded on D4 framework
- Manages agent state and interactions

### Scripts

#### Development (`scripts/dev.sh`)
- Development environment setup
- Local testing utilities

## Architecture Flow

```
Web Dashboard → TEE Worker → Smart Contract → Shade Protocol
```

## Security Model

- TEE (Trusted Execution Environment) ensures secure computation
- Smart contract manages state transitions
- Decentralized validation through Shade Protocol