# Use an official Node.js LTS (Long Term Support) as the base image
FROM node:lts

# Set the working directory inside the container
WORKDIR /app

# Install server dependencies
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
