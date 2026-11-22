#!/usr/bin/env bash
# Выкатка New Organic: основной адрес https://packman-prod.ru/neworganic/ (сервер Packman в РФ, Caddy),
# запасной на GitHub Pages. Маршрут /neworganic/ описан в ~/Desktop/ClaudeCode/packman_site/Caddyfile.
set -euo pipefail
cd "$(dirname "$0")"
# тяжёлые файлы на Selectel S3 (ключи из окружения бота), страницы на сервер
set -a; source ~/Desktop/ClaudeCode/igor_pc_kit/envs/ugc_bot_v2/.env >/dev/null 2>&1; set +a
~/Desktop/ClaudeCode/.ship_vpn/.venv/bin/python s3sync.py
rsync -az --delete --exclude .git --exclude _pages.py --exclude deploy.sh --exclude s3sync.py --exclude media --exclude img/shot2 --exclude img/scene --exclude img/p --exclude img/shot --exclude img/founder.webp --exclude .gitignore --exclude .nojekyll --exclude .DS_Store \
  ./ root@176.122.27.134:/root/rank/neworganic/
git add -A && git commit -qm "${1:-Выкатка}" || true
git push -q
curl -sf -o /dev/null https://packman-prod.ru/neworganic/ && echo "ок: https://packman-prod.ru/neworganic/"
