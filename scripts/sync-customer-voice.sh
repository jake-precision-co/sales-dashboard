#!/usr/bin/env bash
# Sync Customer Voice markdown files from the vault into the repo.
# Run before deploying to ensure Vercel gets the latest content.
#
# Usage: bash scripts/sync-customer-voice.sh

set -euo pipefail

VAULT="/Users/bettyjoe/.openclaw/workspace-betty-jo/vault/CRO/Intelligence"
DEST="$(dirname "$0")/../data/customer-voice"

mkdir -p "$DEST"

cp "$VAULT/pain-buckets.md"        "$DEST/pain-buckets.md"
cp "$VAULT/prospect-roadblocks.md" "$DEST/prospect-roadblocks.md"
cp "$VAULT/prospect-dreams.md"     "$DEST/prospect-dreams.md"
cp "$VAULT/prospect-objections.md" "$DEST/prospect-objections.md"

echo "✓ Synced 4 files to $DEST"
