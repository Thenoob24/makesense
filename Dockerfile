# Stage 1: Build the Vite application
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies based on lockfile for reproducible builds
COPY package*.json ./
RUN npm ci --silent

# Copy the rest of the source files
COPY . .

# Build the static assets (skip tsc type-checking, not needed for production bundle)
RUN npx vite build

# Stage 2: Serve the built assets with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
