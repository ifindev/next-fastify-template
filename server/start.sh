#!/bin/sh

# install new dependencies if any
npm install

# @see: https://medium.com/hacktive-devs/the-bcrypt-bg-on-docker-9bc36cc7f684
# uninstall the current bcrypt modules
npm uninstall bcrypt

# install the bcrypt modules for the machine
npm install bcrypt

# Generate Prisma client at runtime
echo "Generating Prisma client..."
npx prisma generate

# Deploy Prisma migrations
echo "Deploying Prisma migrations..."
npm run db:deploy

# Start the application
echo "Starting application..."
exec npm run dev 