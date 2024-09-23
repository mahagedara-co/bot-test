# Use Node.js Alpine version as the base image
FROM node:16-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project into the container
COPY . .

# Expose port 3000 for the web server
EXPOSE 3000

# Start the bot
CMD ["node", "bot.js"]
