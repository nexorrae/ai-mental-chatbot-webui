#!/bin/sh

# Default to same-origin if not set at runtime
API_URL=${VITE_API_URL:-}
CONTENT_API_BASE=${VITE_CONTENT_API_BASE:-}

# Create the config file using the runtime environment variable
echo "Generating env-config.js with API_URL: $API_URL | CONTENT_API_BASE: $CONTENT_API_BASE"

cat <<EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  VITE_API_URL: "$API_URL",
  VITE_CONTENT_API_BASE: "$CONTENT_API_BASE",
};
EOF

# Start Nginx
exec "$@"
