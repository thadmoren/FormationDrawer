#!/bin/zsh
# Double-click to serve Formation Drawer on port 5003 (phone: Tailscale URL + :5003)
cd "$(dirname "$0")"
echo "Formation Drawer → http://localhost:5003  (Ctrl-C to stop)"
python3 -m http.server 5003
