# DEVELOPMENT

FROM node:latest AS dev

ENV NODE_ENV=development

WORKDIR /laruno-api/app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

# PRODUCTION

FROM node:latest AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /laruno-api/app

COPY package.json ./

RUN npm install --only=production

COPY . .

COPY --from=dev /laruno-api/app/dist ./dist

EXPOSE 5000

CMD ["npm", "run", "start:prod", "start:dev"]
