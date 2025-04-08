# Stage 1: Development stage
FROM node:18 as development

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the development server port
EXPOSE 4200

# The development command will be set in docker-compose.override.yml
CMD ["npm", "start"]

# Stage 2: Build stage
FROM development as build

# Build the application for production
RUN npm run build

# Stage 3: Production stage with Nginx
FROM nginx:1.23-alpine as production

# Copy the build output to replace the default nginx contents
COPY --from=build /app/dist/todo-list-frontend /usr/share/nginx/html

# Copy custom nginx configuration for the Angular app (handles routing)
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
