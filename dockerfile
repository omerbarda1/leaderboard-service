# Use an official Node.js runtime as the base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the app port
EXPOSE 3000

# Run the app
CMD ["npm", "run", "start:prod"]
