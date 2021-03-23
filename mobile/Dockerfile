FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install -g create-react-native-app react-native-cli
RUN create-react-native-app mobile
COPY . .
CMD [ "npm", "start" ]