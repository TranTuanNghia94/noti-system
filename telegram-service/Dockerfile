FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json ./

# Install production dependencies only
RUN npm install

COPY . .

# Expose the port the app runs on
EXPOSE 3002

# Command to run the application
CMD ["npm", "run", "start:dev"] 