# m2l-server
More2Life App Server

## Setup

1. `git clone git@github.com:More2Life/m2l-server.git`
2. `cd m2l-server`
3. `npm install`
4. Setup [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
5.  `heroku config:get MONGODB_URI_TEST -s  >> .env`
6. Build locally with `heroku local web`