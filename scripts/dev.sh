#!/bin/bash

# ORPA Shade Agent Development Script

set -e

echo "🚀 Starting ORPA Shade Agent Development Environment"

# Check if required tools are installed
check_deps() {
    echo "📋 Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js not found. Please install Node.js"
        exit 1
    fi
    
    if ! command -v cargo &> /dev/null; then
        echo "❌ Rust/Cargo not found. Please install Rust"
        exit 1
    fi
    
    echo "✅ Dependencies check passed"
}

# Setup worker environment
setup_worker() {
    echo "⚙️ Setting up TEE Worker..."
    cd apps/worker
    if [ ! -f "package.json" ]; then
        echo "📦 Initializing worker package..."
        npm init -y
        npm install --save-dev typescript @types/node ts-node
    fi
    cd ../..
}

# Setup contracts
setup_contracts() {
    echo "🔧 Setting up Smart Contracts..."
    cd contracts/orpa_agent
    if [ ! -f "Cargo.toml" ]; then
        echo "📦 Initializing Rust contract..."
        cargo init --lib
    fi
    cd ../..
}

# Main execution
main() {
    check_deps
    setup_worker
    setup_contracts
    
    echo ""
    echo "🎉 Development environment ready!"
    echo ""
    echo "Next steps:"
    echo "  • cd apps/worker && npm run dev"
    echo "  • cd contracts/orpa_agent && cargo build"
    echo ""
}

main "$@"