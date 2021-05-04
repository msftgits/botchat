FROM node:alpine

RUN apk update && \
    apk upgrade && \
    apk add --no-cache bash git openssh

ENV PORT=80
EXPOSE 80
RUN npm install serve@11.3.0 -g
WORKDIR /web/
ENTRYPOINT ["npx", "--no-install", "serve", "-c", "serve-test.json", "-p", "80", "/web/"]

ADD serve-test.json /web/
ADD __tests__/html/ /web/__tests__/html/
ADD packages/bundle/dist/webchat-es5.js /web/packages/bundle/dist/
ADD packages/test/harness/dist/ /web/packages/test/harness/dist/
ADD packages/test/page-object/dist/ /web/packages/test/page-object/dist/
RUN echo {}>/web/package.json
