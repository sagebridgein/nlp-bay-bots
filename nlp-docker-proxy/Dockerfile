FROM nginx:1.14.1-alpine

COPY nginx.conf /etc/nginx/nginx.conf

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

CMD ["nginx", "-g", "daemon off;"]
