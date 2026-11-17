#!/bin/bash
cd "$(dirname "$0")"

echo "=========================================================="
echo "          NAILS BY SIRII - STUDIO OPERATING SYSTEM         "
echo "=========================================================="
echo "Starting local atelier server on http://localhost:3001..."

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not found. Please install Node.js from https://nodejs.org"
    read -p "Press Enter to exit..."
    exit 1
fi

# Open default browser after a brief delay in the background
(sleep 1 && open "http://localhost:3001") &

# Start backend server which serves both API and static production app
node server/index.js

