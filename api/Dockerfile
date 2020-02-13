FROM node:latest

RUN mkdir -p /src/app
WORKDIR /src/app

COPY . .

RUN npm install
RUN npm install typescript -g
RUN npm run build

COPY /assets /src/app/dist/assets

EXPOSE 3500

CMD ["node", "/src/app/dist/server.js"]
