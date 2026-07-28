# Layer 5: Hosting & Deployment - Multi-stage Production Dockerfile

# Stage 1: Build Client
FROM node:18-alpine AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build || mkdir -p dist

# Stage 2: Production Server Setup
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY server/package*.json ./server/
RUN cd server && npm ci --only=production

COPY server/ ./server/
COPY --from=client-builder /app/client/dist ./server/public

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "server/index.js"]
