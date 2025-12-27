# ======================
# Base dependencies
# ======================
FROM node:24.12.0-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

# ======================
# Build stage
# ======================
FROM node:24.12.0-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build
