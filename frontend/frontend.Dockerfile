# Stage 1: Build the React app
FROM node:16 AS build

WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies with legacy peer deps
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copy the rest of the application code
COPY . .

# Build the React app for production
RUN npm run build

# Stage 2: Serve the app using Nginx
FROM nginx:alpine

# Copy the build output to the Nginx web server
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]