FROM node:22-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy source files
COPY . .

# Build the static assets
RUN npx vite build

# Install a lightweight static server with SPA support
RUN npm install -g serve

# Serve the built files — the -s flag enables SPA fallback (all routes → index.html)
EXPOSE 3000
CMD ["serve", "dist", "-s", "-l", "3000"]
