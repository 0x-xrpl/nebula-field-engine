#!/usr/bin/env bash

set -euo pipefail

POINT="${1:-}"

if [[ -z "$POINT" ]]; then
  echo "Usage: scripts/restore_base_point.sh BASE_WORKING_POINT_v1.3"
  exit 1
fi

ARCHIVE="${POINT}.zip"

if [[ ! -f "$ARCHIVE" ]]; then
  echo "Archive ${ARCHIVE} not found in $(pwd)"
  exit 1
fi

echo "Restoring workspace from ${ARCHIVE} ..."
unzip -oq "$ARCHIVE"
echo "Workspace restored to ${POINT}."
