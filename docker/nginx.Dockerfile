FROM nginx:1.27-alpine
COPY yzb-qd/nginx.conf /etc/nginx/conf.d/default.conf
COPY yzb-qd/dist /usr/share/nginx/html
EXPOSE 80
