#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="${SCRIPT_DIR}/.webapplab-vite.pid"
URL_FILE="${SCRIPT_DIR}/.webapplab-vite.urls"

if [[ ! -f "${PID_FILE}" ]]; then
  echo "Aplicação não está em execução."
  exit 0
fi

pid="$(tr -d '[:space:]' < "${PID_FILE}")"
if [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null; then
  kill "${pid}" 2>/dev/null || true
fi

rm -f "${PID_FILE}" "${URL_FILE}"
echo "Aplicação encerrada."
