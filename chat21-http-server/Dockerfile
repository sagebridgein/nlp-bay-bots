# FROM node:16

# # Create app directory
# WORKDIR /usr/src/app

# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)

# COPY package*.json ./

# RUN npm install

# # Bundle app source
# COPY . .

# EXPOSE 8004

# CMD [ "npm", "start" ]



FROM node:16

# Set the working directory
WORKDIR /usr/src/app

# Copy package files first (leverage Docker caching for dependencies)
COPY package*.json ./

# Set npm config for better reliability
RUN npm config set timeout 60000 \
    && npm config set registry https://registry.npmjs.org/

# Install app dependencies with additional resilience
RUN npm install --prefer-offline --no-audit --progress=false

# Copy application source code
COPY . .

# Expose the desired port
EXPOSE 8004

# Define the command to run the application
CMD [ "npm", "start" ]
