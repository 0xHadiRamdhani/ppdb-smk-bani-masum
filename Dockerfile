# ===== Stage 1: Dependencies =====
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# ===== Stage 2: Builder =====
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client sebelum build
RUN npx prisma generate --schema=prisma/schema.prisma

# Build aplikasi Next.js
RUN npm run build

# ===== Stage 3: Runner (Production) =====
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

# Buat user non-root untuk keamanan
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy file public dan build output
COPY --from=builder /app/public ./public

# Copy standalone output (dioptimasi Next.js)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma schema dan generated client
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/app/generated ./app/generated

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
