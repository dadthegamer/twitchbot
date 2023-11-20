# Use a Node.js base image
FROM node:lts

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app source code
COPY . /app

# Build the app
RUN npm run build

# Expose port for running the app
EXPOSE 3000 

# Set command to start app
CMD ["npm", "start"]