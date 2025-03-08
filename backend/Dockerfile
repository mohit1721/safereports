# Use official Node.js LTS image
FROM node:20

# Set working directory inside container
WORKDIR /backend

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the application port
EXPOSE 5000

# Start the server (change "dev" to "start" if needed)
# CMD ["npm", "run", "dev"]
# MongoDB connect hone ka wait karo aur backend start karo
CMD ["sh", "-c", "sleep 5 && npm run dev"]
