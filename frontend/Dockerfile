# frontend/Dockerfile
FROM node:20-alpine
WORKDIR /app

# Copy package files dulu untuk caching layer
COPY package*.json ./
RUN npm install

# Copy sisa file project
COPY . .

EXPOSE 5173

# Tambahkan --host agar Vite bisa listen di network Docker
CMD ["npm", "run", "dev", "--", "--host"]