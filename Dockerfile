# Stage 1: Build the Vite application
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies based on lockfile for reproducible builds
COPY package*.json ./
RUN npm ci --silent

# Copy the rest of the source files
COPY . .

# Build the static assets
RUN npm run build

# Stage 2: Serve the built assets with Nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional custom Nginx config (can be added later if needed)
#COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;" ]
