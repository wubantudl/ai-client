#!/bin/bash

echo "========================================"
echo "  AI Client Build Script"
echo "========================================"
echo

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed!"
    echo "Please install from https://nodejs.org"
    exit 1
fi

# Check Rust
if ! command -v cargo &> /dev/null; then
    echo "[ERROR] Rust is not installed!"
    echo "Please install from https://rustup.rs"
    exit 1
fi

echo "[OK] Environment check passed"
echo

# Install pnpm if not exists
if ! command -v pnpm &> /dev/null; then
    echo "Installing pnpm..."
    npm install -g pnpm
fi

# Install dependencies
echo "Installing dependencies..."
pnpm install

# Build
echo "Building application..."
pnpm tauri build

echo
echo "========================================"
echo "  Build completed successfully!"
echo "========================================"
echo
echo "Output: src-tauri/target/release/bundle/"
