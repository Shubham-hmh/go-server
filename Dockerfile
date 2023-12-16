# Use Node.js version 18.12.1 on Alpine Linux
FROM node:18.12.1-alpine
# Create the application directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
# Install FFmpeg and other system dependencies
RUN apk add --no-cache ffmpeg
# Set environment variables for FFmpeg
ENV FFMPEG_HOME=/usr/local/ffmpeg
ENV PATH="$PATH:$FFMPEG_HOME/bin"
# For installing sharp (if needed)
RUN npm config set unsafe-perm true
# Copy package.json and package-lock.json to the container
COPY package*.json ./
# Install project dependencies
RUN npm install
# Copy the rest of your application code to the container
COPY . .
# Expose port 5000 for your server
EXPOSE 5000
# Define the command to start your server
CMD ["npm", "run", "server"]
