# YerLab API container. Build context = repo root:
#   docker build -f apps/api/Dockerfile -t yerlab-api .
#   docker run -p 4000:4000 --env-file apps/api/.env yerlab-api
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
COPY packages/types/package.json packages/types/
COPY apps/api/package.json apps/api/
RUN npm install
COPY packages/types packages/types
COPY apps/api apps/api
RUN npm run build -w @yerlab/types && npm run build -w @yerlab/api

FROM node:20-slim AS run
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/package.json ./apps/api/package.json
RUN mkdir -p apps/api/uploads
EXPOSE 4000
CMD ["node", "apps/api/dist/index.js"]
