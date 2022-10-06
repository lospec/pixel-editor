FROM node:16-alpine3.15

RUN apk add git

# Docker has --chown flag for COPY, but it does not expand ENV so we fallback to:
# COPY src src 
# RUN sudo chown -R $USER:$USER $HOME

WORKDIR /home/node/app
COPY ./ /home/node/app
RUN chown -R node:node /home/node/app 

USER node
RUN npm install

CMD ["npm", "run", "hot"]
