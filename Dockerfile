# Production Dockerfile for Backend API
FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install backend dependencies
COPY server/package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY server/ ./

EXPOSE 5000

CMD ["node", "src/server.js"]
