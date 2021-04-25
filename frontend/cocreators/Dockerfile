FROM node:12.2.0-alpine
WORKDIR /home/app
RUN mkdir -p /home/app
COPY . /home/app
RUN npm install 
CMD ["npm", "start"]
