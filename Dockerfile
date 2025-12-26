FROM node:20-bookworm-slim

WORKDIR /app

# Install deps first (better layer caching)
COPY package.json package-lock.json* ./
RUN npm install

# App source
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]


