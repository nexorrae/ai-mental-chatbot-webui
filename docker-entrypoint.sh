#!/bin/sh

# Default to the build-time variable if not set at runtime
API_URL=${VITE_API_URL:-http://localhost:3000}

# Create the config file using the runtime environment variable
echo "Generating env-config.js with API_URL: $API_URL"

cat <<EOF > /usr/share/nginx/html/env-config.js
window._env_ = {
  VITE_API_URL: "$API_URL",
};
EOF

# Start Nginx
exec "$@"
