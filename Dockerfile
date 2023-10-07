# Stage 1: Build the React client
FROM node:14 as client-builder
WORKDIR /app/client
COPY ./src/client/package*.json ./
RUN npm install
COPY ./src/client ./
RUN npm run build

# Stage 2: Build the Node.js server
FROM node:14 as server-builder
WORKDIR /app/server
COPY ./src/server/package*.json ./
RUN npm install
COPY ./src/server ./

# Stage 3: Combine the client and server
FROM node:14
WORKDIR /app
COPY --from=client-builder /app/client/build ./client
COPY --from=server-builder /app/server ./

# Install production dependencies for the server
RUN npm install --only=production

EXPOSE 3001
CMD ["npm", "start"]