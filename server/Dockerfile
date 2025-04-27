FROM node:20-alpine

WORKDIR /app

# Install OpenSSL - required for Prisma
RUN apk add --no-cache openssl openssl-dev

# For compatibility with openssl 1.1.x required by Prisma
RUN apk add --no-cache libc6-compat

# Copy package files
COPY package.json package-lock.json ./

# Copy prisma files
COPY prisma ./prisma/

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