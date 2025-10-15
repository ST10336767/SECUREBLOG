# Multi-stage build for secure blog application
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY secureblog-backend/package*.json ./secureblog-backend/
COPY secureblog-frontend/package*.json ./secureblog-frontend/

# Install dependencies
RUN npm install
RUN cd secureblog-backend && npm install
RUN cd secureblog-frontend && npm install

# Backend build stage
FROM base AS backend-build
WORKDIR /app/secureblog-backend

# Copy backend source code
COPY secureblog-backend/ .

# Expose backend port
EXPOSE 5000

# Start backend server
CMD ["npm", "start"]

# Frontend build stage
FROM base AS frontend-build
WORKDIR /app/secureblog-frontend

# Copy frontend source code
COPY secureblog-frontend/ .

# Build frontend
RUN npm run build

# Production stage for frontend
FROM nginx:alpine AS frontend-prod
COPY --from=frontend-build /app/secureblog-frontend/dist /usr/share/nginx/html
COPY --from=frontend-build /app/secureblog-frontend/ssl /etc/nginx/ssl

# Copy nginx configuration for HTTPS
RUN echo 'server { \
    listen 443 ssl; \
    server_name localhost; \
    ssl_certificate /etc/nginx/ssl/cert.pem; \
    ssl_certificate_key /etc/nginx/ssl/key.pem; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]

# Development stage (for docker-compose)
FROM base AS development
WORKDIR /app

# Copy all source code
COPY . .

# Expose ports
EXPOSE 5000 5173

# Start both services in development mode
CMD ["sh", "-c", "cd secureblog-backend && npm run dev & cd secureblog-frontend && npm run dev & wait"]
