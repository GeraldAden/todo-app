FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000" ]