FROM node:20-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm install
COPY server/ ./
RUN npm run build
EXPOSE 4000
CMD ["node", "dist/app.js"]