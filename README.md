# m2l-server
More2Life App Server
[API Doc](https://more2life.github.io/m2l-server/)

## Setup

1. `git clone git@github.com:More2Life/m2l-server.git`
2. `cd m2l-server`
3. `npm install`
4. Setup [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli) (but skip the `heroku create` step)
5. `heroku git:remote -a m2l-server`
6. Copy Heroku config values
    ```
    heroku config:get MONGODB_URI_TEST -s  >> .env
    heroku config:get EVENTBRITE_BEARER_TOKEN -s  >> .env
    heroku config:get SHOPIFY_ACCESS_TOKEN -s  >> .env
    heroku config:get REDIS_URL -s  >> .env
    
7. Build locally with `heroku local web`
