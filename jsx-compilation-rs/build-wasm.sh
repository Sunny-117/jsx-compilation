#!/bin/bash

# Build script for WASM package

set -e

echo "🦀 Building JSX Compilation WASM package..."

# Check if wasm-pack is installed
if ! command -v wasm-pack &> /dev/null; then
    echo "❌ wasm-pack is not installed. Please install it first:"
    echo "   curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh"
    exit 1
fi

# Build the WASM package
echo "📦 Building WASM package..."
wasm-pack build --target web --out-dir pkg-web --scope jsx-compilation

# Build for Node.js as well
echo "📦 Building Node.js package..."
wasm-pack build --target nodejs --out-dir pkg-node --scope jsx-compilation

# Build for bundlers
echo "📦 Building bundler package..."
wasm-pack build --target bundler --out-dir pkg --scope jsx-compilation

echo "✅ WASM packages built successfully!"
echo ""
echo "📁 Output directories:"
echo "   - pkg/        (for bundlers like webpack, vite)"
echo "   - pkg-web/    (for web/ES modules)"
echo "   - pkg-node/   (for Node.js)"
echo ""
echo "🚀 You can now use the WASM package in your JavaScript projects!"
