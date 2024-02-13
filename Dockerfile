# Use Node 18 alpine as parent image
FROM node:18-alpine

# Set the timezone to Asia/Bangkok
ENV TZ=Asia/Bangkok

# Install tzdata to set the correct timezone
RUN apk --no-cache add tzdata

# Change the working directory on the Docker image to /app
WORKDIR /app

# Copy package.json and package-lock.json to the /app directory
COPY package.json package-lock.json ./

RUN npm ci --only=production && npm cache clean --force
# Install dependencies
RUN npm install

# Copy the rest of project files into this image
COPY . .

# Expose application port
EXPOSE 3000

# Start the application
CMD npm start
