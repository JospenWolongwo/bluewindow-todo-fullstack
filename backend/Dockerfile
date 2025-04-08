FROM node:18-alpine

WORKDIR /usr/src/app

# Install dependencies with legacy peer deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy app files
COPY . .

# Build and clean up
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]