# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package manifests first so npm can install workspace deps with cacheable layers
COPY package.json package-lock.json* ./
COPY apps/landing-next/package.json apps/landing-next/package.json
COPY apps/app-vite/package.json apps/app-vite/package.json
COPY packages/design-system/package.json packages/design-system/package.json

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build only the static Vite app for Nginx runtime
RUN npm run build --workspace @curhatin/app-vite

# Runtime stage
FROM nginx:alpine AS runtime

# Copy built assets from builder
COPY --from=builder /app/apps/app-vite/dist /usr/share/nginx/html

# Copy custom nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Copy entrypoint script
COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

# Start nginx via entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
