# Use an official Node.js image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose port 3000 for the web server
EXPOSE 3000

# Start the bot
CMD ["node", "bot.js"]
