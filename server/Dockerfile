FROM linux:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./


# Install dependencies
RUN npm ci

# Copy the startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# Copy the rest of the app
COPY . .

# Expose port
EXPOSE 3001

# Start the application using the startup script
CMD ["/app/start.sh"] 