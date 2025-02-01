FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

# Install build tools for bcrypt
RUN apt-get update && apt-get install -y python3 build-essential

# Install dependencies
RUN npm ci --only=production

# Rebuild bcrypt
RUN npm rebuild bcrypt --build-from-source

COPY . .

EXPOSE 5001
CMD ["node", "app.js"]