FROM        node
MAINTAINER  goliatone <burgosemi@gmail.com>

RUN \
    mkdir -p /usr/src/app

WORKDIR /usr/src/app

# Add dumb-init to solve docker's dangling pid 0
RUN wget -O /usr/local/bin/dumb-init https://github.com/Yelp/dumb-init/releases/download/v1.2.0/dumb-init_1.2.0_amd64 && \
    chmod +x /usr/local/bin/dumb-init && \
    #install dependencies for canvas < face-crop < routes/image
    apt-get update
    #&& apt-get install -y build-essential g++

#use changes to package.json to force Docker to not use
#cache. Use docker build --no-cache to force npm install.
ADD ./backend/package.json /tmp/package.json

RUN cd /tmp && npm install --production
RUN cp -a /tmp/node_modules /usr/src/app/

COPY ./backend/ /usr/src/app
COPY ./README.md /usr/src/README.md

#compile frontend
COPY ./frontend/ /tmp/frontend
RUN cd /tmp/frontend && npm i  && \
    npm run build && \
    mkdir -p ./usr/src/app/modules/server/public/build && \
    cp -r /tmp/frontend/public/* /usr/src/app/modules/server/public && \
    rm -f /usr/src/app/modules/server/public/index.html

RUN cp -a /tmp/node_modules /usr/src/app/

# Ensure this ports match the ones in docker-compose
# the and .envset file
EXPOSE 1981 9090

CMD ["dumb-init", "node", "index.js"]
