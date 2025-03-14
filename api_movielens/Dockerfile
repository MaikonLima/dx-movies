FROM node:20-alpine
RUN apk update && \
    apk add --no-cache openssl3
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npx prisma migrate
EXPOSE 3000
CMD ["npm", "start"]