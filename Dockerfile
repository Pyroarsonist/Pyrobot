FROM mhart/alpine-node:14 AS BUILDER

WORKDIR /app

COPY . .

RUN yarn
RUN yarn build


FROM mhart/alpine-node:14

WORKDIR /app
COPY --from=BUILDER /app .

EXPOSE 3000
CMD ["node", "./build/index.js"]
