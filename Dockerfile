# DEVELOPMENT

FROM node:alpine AS dev

ENV NODE_ENV=development

WORKDIR /app/laruno-api

COPY package.json ./

RUN npm install

COPY . .

RUN npm run start:dev

# RUN npm run build

# PRODUCTION

# FROM node:latest AS production

# ARG NODE_ENV=production
# ENV NODE_ENV=${NODE_ENV}

# WORKDIR /app/laruno-api

# COPY package.json ./

# RUN npm install --only=production

# COPY . .

# COPY --from=dev /app/laruno-api/dist ./dist

# EXPOSE 5000

CMD ["npm", "run", "start:prod", "start:dev"]
