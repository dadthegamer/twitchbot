#!/bin/bash

# Start the Node.js server in the background
cd /app/server
npm start &

# Start the React.js client
cd /app/client
npm start