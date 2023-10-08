# Stage 1 - Build React App
FROM node:14 AS client-build
WORKDIR /app/client
COPY ./src/client/package.json ./
RUN npm install
COPY ./src/client ./
RUN npm run build

# Stage 2 - Build Node.js Server 
FROM node:14 AS server-build
WORKDIR /app/server
COPY ./src/server/package.json ./
RUN npm install --production
COPY ./src/server ./

# Copy built React app into server image
COPY --from=client-build /app/client/build ./client

# Stage 3 - Final image
FROM node:14
WORKDIR /app
COPY --from=server-build /app/server ./

# Expose ports
EXPOSE 3000 3001 

# Start server
CMD ["npm", "start"]