# Use a Node.js base image
FROM node:16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies  
RUN npm install

# Copy app source code
COPY . /app

# Expose port and start app
EXPOSE 3001
CMD ["npm", "start"]