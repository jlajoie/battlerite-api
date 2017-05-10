FROM node:6.3.1

WORKDIR /src/

COPY ./ /src

RUN npm install -q

# Append local node_modules binaries to path
ENV PATH "$PATH:node_modules/.bin"
