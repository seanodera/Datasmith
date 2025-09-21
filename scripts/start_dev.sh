#!/bin/bash

PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

# Start FastAPI backend
echo "Starting FastAPI backend..."
cd "$PROJECT_ROOT/backend-py" || exit 1
source .venv/bin/activate
if ! command -v uvicorn &> /dev/null; then
  echo "uvicorn not found in .venv. Did you install your dependencies?"
  exit 1
fi
uvicorn app.main:app --reload &

# Start Vite frontend
echo "Starting Vite frontend..."
cd "$PROJECT_ROOT/frontend-ts" || exit 1
if [ -f yarn.lock ]; then
  yarn run dev
else
  npm run dev
fi

wait