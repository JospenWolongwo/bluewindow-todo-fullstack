FROM node:18-alpine as development

WORKDIR /usr/src/app

# Install dependencies with legacy peer deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy app files
COPY . .

# Development stage exposes port for development server
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

# Build stage
FROM development as build

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine as production

WORKDIR /usr/src/app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm install --only=production --legacy-peer-deps

# Copy built app from build stage
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules

EXPOSE 3000
CMD ["npm", "run", "start:prod"]