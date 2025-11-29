#!/usr/bin/env bash
set -euo pipefail

POINT="${1:-}"
if [[ -z "$POINT" ]]; then
  echo "Usage: scripts/tag_base_point.sh BASE_WORKING_POINT_v1.5"
  exit 1
fi

git tag -f "$POINT"
echo "Tagged current commit as $POINT."
