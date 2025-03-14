FROM node:20-alpine as build
WORKDIR /app
COPY package*.json /app/
COPY yarn.lock /app/
RUN npm install --force
COPY . /app
RUN npx ng build --output-path=dist

FROM nginx
EXPOSE 80
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
COPY --from=build /app/dist/ .
CMD [ "nginx", "-g", "daemon off;" ]
