FROM node:18.14.2-alpine3.17

COPY . /opt/whats-in-my-fridge
WORKDIR /opt/whats-in-my-fridge
RUN npm ci --only=production

EXPOSE 3001

CMD ["npm", "start"]