FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG DEPLOY_REVISION
RUN npm run build \
    && test -n "${DEPLOY_REVISION}" \
    && printf '%s\n' "${DEPLOY_REVISION}" > dist/revision.txt

FROM nginx:alpine

COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
