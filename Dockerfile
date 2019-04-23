#pull from the official image
FROM node:alpine

WORKDIR .
COPY . .

# Set proxy server, replace host:port with values for your servers
#ENV http_proxy http://127.0.0.1:8123/
#ENV https_proxy http://127.0.0.1:8123/

EXPOSE 3030

RUN apk add bash
RUN npm install

CMD ./wait-for mongodb:27017 -q -t 20 -- npm start
