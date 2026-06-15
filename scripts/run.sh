#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd -- "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd -- "${SCRIPT_DIR}/.." && pwd)"
APP_NAME="$(basename "${PROJECT_DIR}")"
PORT="${PORT:-${WEBAPPLAB_PORT:-8080}}"
PID_FILE="${SCRIPT_DIR}/.webapplab-vite.pid"
URL_FILE="${SCRIPT_DIR}/.webapplab-vite.urls"
LOG_FILE="${SCRIPT_DIR}/webapplab-vite.log"

is_running() {
  local pid="$1"
  [[ -n "${pid}" ]] && kill -0 "${pid}" 2>/dev/null
}

collect_urls() {
  local port="$1"
  printf 'http://127.0.0.1:%s\nhttp://localhost:%s\n' "${port}" "${port}"
}

if [[ ! -d "${PROJECT_DIR}/node_modules" ]]; then
  echo "Dependências não instaladas. Execute: npm install"
  exit 1
fi

if [[ -f "${PID_FILE}" ]]; then
  existing_pid="$(tr -d '[:space:]' < "${PID_FILE}")"
  if is_running "${existing_pid}"; then
    echo "${APP_NAME} já está em execução."
    cat "${URL_FILE}" 2>/dev/null || collect_urls "${PORT}"
    exit 0
  fi
  rm -f "${PID_FILE}"
fi

collect_urls "${PORT}" > "${URL_FILE}"

cd "${PROJECT_DIR}"
if command -v setsid >/dev/null 2>&1; then
  nohup setsid npm run dev -- --port "${PORT}" > "${LOG_FILE}" 2>&1 &
else
  nohup npm run dev -- --port "${PORT}" > "${LOG_FILE}" 2>&1 &
fi
server_pid="$!"
echo "${server_pid}" > "${PID_FILE}"

sleep 2
if ! is_running "${server_pid}"; then
  echo "Erro: falha ao iniciar ${APP_NAME}."
  tail -n 30 "${LOG_FILE}" 2>/dev/null || true
  rm -f "${PID_FILE}"
  exit 1
fi

echo "${APP_NAME} iniciado."
cat "${URL_FILE}"
