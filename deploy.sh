#!/usr/bin/env bash
# Выкатка New Organic: основной адрес https://packman-prod.ru/neworganic/ (сервер Packman в РФ, Caddy),
# запасной на GitHub Pages. Маршрут /neworganic/ описан в ~/Desktop/ClaudeCode/packman_site/Caddyfile.
set -euo pipefail
cd "$(dirname "$0")"
rsync -az --delete --exclude .git --exclude _pages.py --exclude deploy.sh --exclude .gitignore --exclude .nojekyll --exclude .DS_Store \
  ./ root@176.122.27.134:/root/rank/neworganic/
git add -A && git commit -qm "${1:-Выкатка}" || true
git push -q
curl -sf -o /dev/null https://packman-prod.ru/neworganic/ && echo "ок: https://packman-prod.ru/neworganic/"
