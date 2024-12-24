# FROM node:16

# RUN sed -i 's/stable\/updates/stable-security\/updates/' /etc/apt/sources.list


# RUN apt-get update

# # Create app directory
# WORKDIR /usr/src/app


# # RUN if [ "$NPM_TOKEN" ]; \
# #     then RUN COPY .npmrc_ .npmrc \
# #     else export SOMEVAR=world; \
# #     fi


# ARG NPM_TOKEN
# RUN if [ -n "$NPM_TOKEN" ]; then \
#     echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc; \
#     fi

    
# # Install app dependencies
# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# # where available (npm@5+)
# COPY package*.json ./

# RUN npm install --production

# RUN rm -f .npmrc

# # Bundle app source
# COPY . .

# EXPOSE 3000

# CMD [ "npm", "start" ]



FROM node:16.17.0

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Use NPM_TOKEN if available
ARG NPM_TOKEN
RUN if [ -n "$NPM_TOKEN" ]; then \
    echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc; \
    fi

# Install dependencies
RUN npm install --production --legacy-peer-deps

# Clean up .npmrc
RUN rm -f .npmrc

# Copy source code
COPY . .

# Expose port and run application
EXPOSE 3000
CMD ["npm", "start"]
