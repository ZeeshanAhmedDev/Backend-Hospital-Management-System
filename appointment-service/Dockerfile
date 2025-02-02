FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all service files
COPY . .

# Expose the service port
EXPOSE 6001

# Start the application
CMD ["node", "app.js"]
