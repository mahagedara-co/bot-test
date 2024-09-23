# Use Node.js Alpine version as the base image
FROM node:16-alpine

# Install git to fetch dependencies from GitHub
RUN apk add --no-cache git

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project into the container
COPY . .

# Expose port 3000 for the web server
EXPOSE 3000

# Start the bot
CMD ["node", "bot.js"]
