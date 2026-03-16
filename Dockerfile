FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm

RUN pnpm install

RUN npm i -g serve

COPY . .

RUN npm run build

CMD [ "serve", "-s", "dist", "-l", "5173" ]
