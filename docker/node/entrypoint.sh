#!/bin/bash
set -e

cd /var/www/workspace/ts/express/app

# Optional: install dependencies
if [ "$NODE_ENV" != "production" ]; then
    npm install
fi

# Start the application
exec npm start
