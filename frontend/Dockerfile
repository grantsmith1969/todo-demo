# syntax=docker/dockerfile:1
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

ARG VITE_GRAPHQL_HTTP=http://localhost:5220/graphql
ARG VITE_GRAPHQL_WS=ws://localhost:5220/graphql
ENV VITE_GRAPHQL_HTTP=$VITE_GRAPHQL_HTTP
ENV VITE_GRAPHQL_WS=$VITE_GRAPHQL_WS

RUN npm run build

FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
