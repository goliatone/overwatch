# Build frontend
FROM node:9.6.1 as builder

RUN mkdir /usr/src/frontend

WORKDIR /usr/src/frontend

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY ./frontend /usr/src/frontend

RUN npm install

RUN npm run build

# Install git in our alpine base image
FROM node:13.12.0-alpine as basenode

RUN apk --update add git less openssh && \
    rm -rf /var/lib/apt/lists/* && \
    rm /var/cache/apk/*

# Build backend
FROM basenode

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY ./backend/ /usr/src/app

COPY ./README.md /usr/src/app/data/pages/ABOUT.md

# Copy frontend from build step
COPY --from=builder /usr/src/frontend/build /usr/src/app/modules/server/public

RUN npm install

# Move our index.html file to the view as an ejs file 
# with the right hashs for bundled files
RUN mv /usr/src/app/modules/server/public/index.html /usr/src/app/modules/server/views/index.ejs

# Ensure this ports match the ones in docker-compose
# the and .envset file
EXPOSE 1981 9090

CMD ["npm", "start"]
