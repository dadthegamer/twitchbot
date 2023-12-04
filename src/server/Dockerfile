# Use a Node.js base image
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies  
RUN npm install

# Copy app source code
COPY . /app

#Set the max memory size for node
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Expose port and start app
EXPOSE 3001
CMD ["npm", "start"]