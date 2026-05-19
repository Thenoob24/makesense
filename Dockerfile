# Stage 1: Build the Vite application
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies based on lockfile for reproducible builds
COPY package*.json ./
RUN npm ci --silent

# Copy the rest of the source files
COPY . .

# Accept Supabase env vars as build args (optional)
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}

# Accept environment variables as build args (with defaults)
ARG VITE_SUPABASE_URL="https://prajvanuzexourcqkchn.supabase.co"
ARG VITE_SUPABASE_ANON_KEY="sb_publishable_-Q4xBgZupZ_O3aRCpjCAdQ_tyRDSMLP"
ARG VITE_LLM7_API_URL="https://api.llm7.io/v1"
ARG VITE_LLM7_API_KEY="i58OYS6Uldlk2XqL9Dm3d/0QRz8psOtIVNvTvAOUMXO3JMnHCC8u22Dt8Hq6bgcg2VAnZDPwfFF4qUBn6HxcQvYGvb5YGgOrFWaORZ437jD851Ew3BGByzlUpFQhmgbQkvwESsWyP9xZ3SIE"

# Make them available during the build
ENV VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
ENV VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
ENV VITE_LLM7_API_URL=${VITE_LLM7_API_URL}
ENV VITE_LLM7_API_KEY=${VITE_LLM7_API_KEY}

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
