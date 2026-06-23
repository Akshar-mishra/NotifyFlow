# 1. Use the lightweight Alpine OS
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /usr/src/app

# 3. Copy ONLY the package files first (Shortcut: Layer Caching)
COPY package*.json ./

# 4. Install production dependencies
RUN npm install --only=production

# 5. Copy the rest of your source code
COPY . .

# 6. Expose your Express port
EXPOSE 8000

# 7. Start the application
CMD ["npm", "start"]