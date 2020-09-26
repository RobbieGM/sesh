FROM node:lts-alpine
WORKDIR /app
RUN mkdir api
COPY api/package.json api
COPY api/package-lock.json api
RUN npm install --production --prefix api
COPY api api
RUN npm run build --prefix api --if-present
RUN npm install --production --prefix database
COPY database database
ENV PORT=8080
EXPOSE 8080
CMD ["npm", "start", "--prefix", "api"]