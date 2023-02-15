FROM node:12-alpine
 
WORKDIR /usr/src/app
 
COPY package.json ./
COPY package-lock.json ./
 
# in workdir install
RUN npm --registry https://registry.npm.taobao.org install
 
# Bundle app source
COPY . ./
 
EXPOSE 4000
CMD ["node","server.js"]