# Stage 1: Build the React application
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# IMPORTANT: We use a placeholder string during build.
# This placeholder will be replaced at runtime by our entrypoint script.
ENV VITE_API_URL=__VITE_API_URL__

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the build output to Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the entrypoint script and make it executable
COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh

# Expose port 80
EXPOSE 80

# Use our entrypoint script to inject variables at runtime
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

# Default command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
