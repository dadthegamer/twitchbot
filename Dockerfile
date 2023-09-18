# Use an official Node.js runtime as a parent image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY src/server/package*.json ./
COPY src/client/package*.json ./client/

# Install server and client dependencies
RUN npm install
RUN cd ./client && npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the React.js client
RUN cd ./client && npm run build

# Copy the start.sh script into the container
COPY start.sh .

# Make the script executable (if needed)
RUN chmod +x start.sh

# Expose the port on which the Node.js server will run (replace with your server's port)
EXPOSE 3000

# Define the command to start the application using the start.sh script
CMD ["./start.sh"]
