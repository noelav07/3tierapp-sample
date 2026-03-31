#!/bin/sh

# The directory where the Nginx static files are located
ROOT_DIR=/usr/share/nginx/html

# Replace placeholders with actual environment variables in all JS files
# This allows us to pass VITE_API_URL at 'docker run' instead of build-time.
echo "Injecting runtime environment variables..."

for file in $ROOT_DIR/assets/*.js;
do
  if [ -f "$file" ]; then
    echo "Processing $file..."
    # Replace the placeholder '__VITE_API_URL__' with the environment variable value
    # We use '|' as a delimiter in sed to avoid issues with '/' in URLs
    sed -i "s|__VITE_API_URL__|${VITE_API_URL}|g" "$file"
  fi
done

if [ -f /etc/nginx/conf.d/default.conf ]; then
  echo "Configuring Nginx reverse proxy..."
  sed -i "s|__BACKEND_URL__|${BACKEND_URL:-http://localhost:3200/api/}|g" /etc/nginx/conf.d/default.conf
fi

echo "Starting Nginx..."
exec "$@"
