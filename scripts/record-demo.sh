#!/usr/bin/env bash
# =============================================================================
# record-demo.sh — Record a 30-second demo GIF for the README
#
# Prerequisites:
#   brew install terminalizer    (macOS)
#   npm install -g terminalizer  (any OS)
#
# Usage:
#   ./scripts/record-demo.sh
#
# Output: docs/screenshots/demo.gif
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
OUTPUT_DIR="$ROOT_DIR/docs/screenshots"
CONFIG_FILE="$SCRIPT_DIR/_demo-config.yml"
RECORDING_FILE="/tmp/datacendia-demo.yml"

mkdir -p "$OUTPUT_DIR"

echo "=== Datacendia Demo Recorder ==="
echo ""
echo "This script records a terminal session showing the quick-start flow."
echo "It produces a GIF suitable for the README hero section."
echo ""

# --- Option 1: Automated with terminalizer ---
if command -v terminalizer &> /dev/null; then
  echo "[1/3] Generating terminalizer config..."
  cat > "$CONFIG_FILE" <<'YAML'
# Terminalizer config for Datacendia demo recording
command: bash -l
cwd: null
env:
  recording: true
cols: 100
rows: 30
repeat: 0
quality: 100
frameDelay: auto
maxIdleTime: 2000
frameBox:
  type: floating
  title: Datacendia — Quick Start
  style:
    border: 0px black solid
    boxShadow: none
    margin: 0px
watermark:
  imagePath: null
  style:
    position: absolute
    right: 15px
    bottom: 15px
    width: 100px
    opacity: 0.9
cursorStyle: block
fontFamily: "JetBrains Mono, Fira Code, Monaco, monospace"
fontSize: 14
lineHeight: 1.4
letterSpacing: 0
theme:
  background: "#0a0a0f"
  foreground: "#e4e4e7"
  cursor: "#c9a84c"
  black: "#1a1a2e"
  red: "#ef4444"
  green: "#22c55e"
  yellow: "#c9a84c"
  blue: "#4a9eff"
  magenta: "#a855f7"
  cyan: "#06b6d4"
  white: "#e4e4e7"
  brightBlack: "#6b6b80"
  brightRed: "#f87171"
  brightGreen: "#4ade80"
  brightYellow: "#d4b55a"
  brightBlue: "#60a5fa"
  brightMagenta: "#c084fc"
  brightCyan: "#22d3ee"
  brightWhite: "#f0f0f5"
YAML

  echo "[2/3] Starting recording..."
  echo ""
  echo "  The recording will auto-type the following commands:"
  echo "    1. git clone https://github.com/datacendia/datacendia-core"
  echo "    2. cd datacendia-core"
  echo "    3. docker compose -f docker-compose.demo.yml up -d"
  echo "    4. Open browser → show Council deliberation"
  echo ""
  echo "  Press Ctrl+D when done to stop recording."
  echo ""

  terminalizer record "$RECORDING_FILE" -c "$CONFIG_FILE"

  echo "[3/3] Rendering GIF..."
  terminalizer render "$RECORDING_FILE" -o "$OUTPUT_DIR/demo.gif"

  echo ""
  echo "=== Done! ==="
  echo "GIF saved to: $OUTPUT_DIR/demo.gif"
  echo "Add to README with: ![Demo](docs/screenshots/demo.gif)"

# --- Option 2: Manual instructions ---
else
  echo "terminalizer not found. Here are manual recording options:"
  echo ""
  echo "Option A — Install terminalizer:"
  echo "  npm install -g terminalizer"
  echo "  ./scripts/record-demo.sh"
  echo ""
  echo "Option B — Use asciinema + svg-term (produces SVG):"
  echo "  brew install asciinema"
  echo "  npm install -g svg-term-cli"
  echo "  asciinema rec /tmp/demo.cast --cols 100 --rows 30"
  echo "  svg-term --in /tmp/demo.cast --out docs/screenshots/demo.svg --window"
  echo ""
  echo "Option C — Use vhs (by Charm):"
  echo "  brew install charmbracelet/tap/vhs"
  echo "  vhs scripts/demo.tape"
  echo ""
  echo "Option D — Screen record with any tool and convert:"
  echo "  ffmpeg -i demo.mp4 -vf 'fps=15,scale=800:-1' docs/screenshots/demo.gif"
  echo ""

  # Generate a VHS tape file as well
  VHS_FILE="$SCRIPT_DIR/demo.tape"
  cat > "$VHS_FILE" <<'TAPE'
# Datacendia Demo — VHS Tape
# Install: brew install charmbracelet/tap/vhs
# Run:     vhs scripts/demo.tape

Output docs/screenshots/demo.gif

Set Shell "bash"
Set FontFamily "JetBrains Mono"
Set FontSize 14
Set Width 1000
Set Height 600
Set Theme { "name": "datacendia", "background": "#0a0a0f", "foreground": "#e4e4e7", "cursor": "#c9a84c", "selection": "#c9a84c33" }
Set Padding 20
Set Framerate 15
Set PlaybackSpeed 1

# Title
Type "# Datacendia — AI Governance with Cryptographic Audit Trails"
Enter
Sleep 1s

# Clone
Type "git clone https://github.com/datacendia/datacendia-core"
Enter
Sleep 2s

# Navigate
Type "cd datacendia-core"
Enter
Sleep 500ms

# Docker compose
Type "docker compose -f docker-compose.demo.yml up -d"
Enter
Sleep 3s

# Simulated output
Type "# ✓ Container datacendia-postgres  Started"
Enter
Sleep 300ms
Type "# ✓ Container datacendia-redis     Started"
Enter
Sleep 300ms
Type "# ✓ Container datacendia-app       Started"
Enter
Sleep 1s

# Open browser
Type "echo '→ Open http://localhost:5173'"
Enter
Sleep 1s

# Show what you get
Type "echo ''"
Enter
Type "echo '🏛️  Council: 20 governance agents + 4 ops agents'"
Enter
Sleep 500ms
Type "echo '🔐  DCII: SHA-256 hashed, Ed25519 signed, Merkle verified'"
Enter
Sleep 500ms
Type "echo '🛡️  Gateway: PII detection, shadow AI monitoring'"
Enter
Sleep 500ms
Type "echo '📦  5 pre-built industry demos included'"
Enter
Sleep 500ms
Type "echo ''"
Enter
Type "echo '→ Live demo: https://app.datacendia.com'"
Enter
Sleep 2s

# Curl health check
Type "curl -s http://localhost:3001/health | jq ."
Enter
Sleep 2s

# Final
Type "echo 'Ready. Apache 2.0 — Your keys, your data.'"
Enter
Sleep 3s
TAPE

  echo "VHS tape file created: $VHS_FILE"
  echo "Run with: vhs scripts/demo.tape"
fi
