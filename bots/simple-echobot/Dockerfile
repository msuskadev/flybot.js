FROM node:latest

RUN mkdir -p /src/app
WORKDIR /src/app

COPY . .

RUN npm install
RUN npm install typescript -g
RUN npm run build

EXPOSE 3980

CMD ["node", "/src/app/dist/server.js"]
