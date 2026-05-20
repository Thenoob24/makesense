FROM node:22-alpine
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --silent

# Copy source files
COPY . .

# Build the static assets
RUN npx vite build

# Serve the built files with vite preview
EXPOSE 3000
CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "3000"]
