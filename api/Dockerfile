FROM node:22-alpine

WORKDIR /app

COPY package.json .

RUN npm install -g pnpm
RUN npm install -g tsx
RUN npm install -g drizzle-kit
RUN npm install -g drizzle-orm

RUN npm install

COPY . .

CMD [ "pnpm", "run", "dev" ]
