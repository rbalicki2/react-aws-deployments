set -e

if [ -z "$CIRCLE_BRANCH" ]; then
  exit 0
else
  ./scripts/do-exclusively.sh --branch master sleep 10
fi
