# Use a lightweight version of Node.js as a parent image
FROM node:16-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application's code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run your app using the web-dev-server
CMD ["npx", "web-dev-server", "--node-resolve", "--watch"]
