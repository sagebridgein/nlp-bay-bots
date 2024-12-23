# ### STAGE 1: Build ###

# # We label our stage as ‘builder’
# FROM node:14-alpine AS builder

# COPY package.json package-lock.json ./

# ## Storing node modules on a separate layer will prevent unnecessary npm installs at each build

# RUN npm ci && mkdir /ng-app && mv ./node_modules ./ng-app

# WORKDIR /ng-app

# COPY . .

# ## Build the angular app in production mode and store the artifacts in dist folder

# #RUN npm run ng build -- --output-path=dist --base-href ./

# # with prod option
# #RUN npm run ng build -- --prod --output-path=dist --base-href ./
# # RUN node --max_old_space_size=8192 node_modules/@angular/cli/bin/ng --configuration production --output-path=dist --base-href ./
# RUN npm run ng build -- --configuration production --output-path=dist --base-href ./

# ### STAGE 2: Setup ###

# FROM nginx:1.14.1-alpine

# ## Copy our default nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

# ## Remove default nginx website
# RUN rm -rf /usr/share/nginx/html/*

# ## From ‘builder’ stage copy over the artifacts in dist folder to default nginx public folder
# COPY --from=builder /ng-app/dist /usr/share/nginx/html

# ##CMD ["nginx", "-g", "daemon off;"]
# CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/dashboard-config-template.json > /usr/share/nginx/html/dashboard-config.json && exec nginx -g 'daemon off;'"]



### STAGE 1: Build ###
FROM node:14-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy only package files to cache dependencies
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy the source code to the container
COPY . .

# Build the Angular application in production mode
RUN npm run ng build -- --configuration production --output-path=dist --base-href ./

### STAGE 2: Setup ###
FROM nginx:1.14.1-alpine

# Set the working directory in the container
WORKDIR /usr/share/nginx/html

# Remove the default NGINX content
RUN rm -rf ./*

# Copy the built Angular application from the builder stage
COPY --from=builder /app/dist .

# Copy the custom NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Use environment substitution for dynamic configuration
CMD ["/bin/sh", "-c", "envsubst < /usr/share/nginx/html/dashboard-config-template.json > /usr/share/nginx/html/dashboard-config.json && exec nginx -g 'daemon off;'"]
