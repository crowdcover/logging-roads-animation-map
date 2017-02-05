FROM nginx:alpine

#Logging Roads Map
MAINTAINER Kristofor Carle - Moabi <kris@loggingroads.org>

RUN mkdir -p /app

WORKDIR /app

COPY ./dist /app/
#update modified timestamps since docker doesn't copy them, needed for last-modified HTTP header
RUN find . -exec touch {} \;

COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]