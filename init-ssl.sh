#!/bin/bash

# Configuration
domains=(curhatinai.com)
rsa_key_size=4096
data_path="./certbot"
email="admin@curhatinai.com"
staging=0 # Production Mode (Reset to 0 as rate limit window passed)

# 1. Detect Docker Compose Version (Fix for User's Environment)
if docker compose version >/dev/null 2>&1; then
  COMPOSE_CMD="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  COMPOSE_CMD="docker-compose"
else
  echo "Error: docker-compose not found."
  exit 1
fi
echo "### Using command: $COMPOSE_CMD"

# 2. Check/Create Network (Fix for 'Network not found' error)
if ! docker network inspect curhatin-network >/dev/null 2>&1; then
  echo "### Creating network 'curhatin-network' ..."
  docker network create curhatin-network
fi

# 3. Download TLS Parameters (Standard)
if [ ! -e "$data_path/conf/options-ssl-nginx.conf" ] || [ ! -e "$data_path/conf/ssl-dhparams.pem" ]; then
  echo "### Downloading recommended TLS parameters ..."
  mkdir -p "$data_path/conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot-nginx/certbot_nginx/_internal/tls_configs/options-ssl-nginx.conf > "$data_path/conf/options-ssl-nginx.conf"
  curl -s https://raw.githubusercontent.com/certbot/certbot/master/certbot/certbot/ssl-dhparams.pem > "$data_path/conf/ssl-dhparams.pem"
  echo
fi

# 4. Create Dummy Certificate (Standard)
if [ -d "$data_path/conf/live/$domains" ]; then
  read -p "Existing data found for $domains. Continue and replace existing certificate? (y/N) " decision
  if [ "$decision" != "Y" ] && [ "$decision" != "y" ]; then
    exit
  fi
fi

echo "### Creating dummy certificate for $domains ..."
path="/etc/letsencrypt/live/$domains"
mkdir -p "$data_path/conf/live/$domains"
$COMPOSE_CMD -f docker-compose.prod.yml run --rm --entrypoint "\
  openssl req -x509 -nodes -newkey rsa:$rsa_key_size -days 1\
    -keyout '$path/privkey.pem' \
    -out '$path/fullchain.pem' \
    -subj '/CN=localhost'" certbot
echo

# 5. Start Nginx (With 'ContainerConfig' Fix)
echo "### Starting nginx ..."
# Fix: Remove old containers to prevent docker-compose v1 KeyError
docker rm -f ai-mental-chatbot-frontend ai-mental-chatbot-frontend-nginx >/dev/null 2>&1
$COMPOSE_CMD -f docker-compose.prod.yml up --force-recreate -d nginx

# 6. Wait for Nginx Healthy (Robustness)
echo "### Waiting for Nginx to be healthy..."
timeout=60
while [ $timeout -gt 0 ]; do
    if docker ps | grep "ai-mental-chatbot-frontend-nginx" | grep "(healthy)" >/dev/null 2>&1; then
        echo "✅ Nginx is healthy!"
        break
    fi
    echo "Waiting for Nginx... ($timeout s)"
    sleep 2
    timeout=$((timeout - 2))
done

if [ $timeout -le 0 ]; then
    echo "❌ ERROR: Nginx failed to start or become healthy."
    echo "Nginx Logs:"
    $COMPOSE_CMD -f docker-compose.prod.yml logs nginx
    exit 1
fi
echo

# 7. Delete Dummy Certificate (Standard - Reinstated)
echo "### Deleting dummy certificate for $domains ..."
$COMPOSE_CMD -f docker-compose.prod.yml run --rm --entrypoint "\
  rm -Rf /etc/letsencrypt/live/$domains && \
  rm -Rf /etc/letsencrypt/archive/$domains && \
  rm -Rf /etc/letsencrypt/renewal/$domains.conf" certbot
echo

# 8. Request Real Certificate (Standard)
echo "### Requesting Let's Encrypt certificate for $domains ..."
domain_args=""
for domain in "${domains[@]}"; do
  domain_args="$domain_args -d $domain"
done

# Select appropriate email arg
case "$email" in
  ("") email_arg="--register-unsafely-without-email" ;;
  (*) email_arg="-m $email" ;;
esac

if [ $staging != "0" ]; then staging_arg="--staging"; fi

$COMPOSE_CMD -f docker-compose.prod.yml run --rm --entrypoint "\
  certbot certonly --webroot -w /var/www/certbot \
    $staging_arg \
    $email_arg \
    $domain_args \
    --rsa-key-size $rsa_key_size \
    --agree-tos \
    --force-renewal" certbot
echo

# 9. Reload Nginx (Standard)
echo "### Reloading nginx ..."
$COMPOSE_CMD -f docker-compose.prod.yml exec nginx nginx -s reload
