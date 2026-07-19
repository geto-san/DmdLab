#!/usr/bin/env bash
# Run this from the ROOT of your DmdLab repo checkout.
set -e

if [ ! -d "client" ] || [ ! -d "server" ]; then
  echo "ERROR: run this from the DmdLab repo root (expected to see client/ and server/ here)."
  exit 1
fi

echo "Removing dead/leftover files..."
rm -f client/src/admin/AdminSidebar.jsx
rm -f client/src/admin/Layout.jsx
rm -f client/src/admin/Login.jsx
rm -f client/src/admin/Logout.jsx
rm -f dmdlab-fixes.patch
rm -f dmdlab-round2.patch dmdlab-round3.patch dmdlab-round4.patch dmdlab-round5.patch 2>/dev/null || true

echo "Extracting fixed files into place..."
tar -xzf dmdlab-files.tar.gz

echo "Done. Now run:"
echo "  git status               # review what changed"
echo "  git add -A"
echo "  git commit -m 'Sync all fixes: server hardening, dead-file removal, Tailwind conversion'"
echo "  git push origin master"
