// @flow

var Koa = require('koa');
var bodyParser = require('koa-body');
var OAuth2Server = require('oauth2-server');

var Model = require('./model');

var KoaRouter = require('koa-router');

class KoaOAuth2Server {
  OAuth2Server: OAuth2Server;
  constructor(options) {
    this.OAuth2Server = new OAuth2Server(options);
  }

  authenticateMiddleware() {
    const self = this;
    return function authenticate(ctx, next) {
      const request = new OAuth2Server.Request(ctx.request);
      const response = new OAuth2Server.Response(ctx.response);
      return self.OAuth2Server.authenticate(request, response);
    }
  }

  authorizeMiddleware(options) {
    const self = this;
    return async function authorize(ctx, next) {
      const request = new OAuth2Server.Request(ctx.request);
      const response = new OAuth2Server.Response(ctx.response);
      const code = await self.OAuth2Server.authorize(request, response, options);  
      ctx.code = code;
      next();
    }
  }

  token() {
    const self = this;
    return async function token(ctx, next) {
      const request = new OAuth2Server.Request(ctx.request);
      const response = new OAuth2Server.Response(ctx.response);
      const newToken = await self.OAuth2Server.token(request, response);
      ctx.token = newToken;
      next();
    }
  }
}

const koaOAuth2Server = new KoaOAuth2Server({model: Model});

const router = new KoaRouter();

const app = new Koa();

app.use(bodyParser({
  urlencoded: true
}));

router.post('/oauth2/token', koaOAuth2Server.token(), (ctx, next) => {
  if (!ctx.token) {
    ctx.status = 400;
    ctx.body = 'Now Allowed';
  } else {
    ctx.body = ctx.token;
    ctx.status = 200;
  }
});

router.post('/oauth2/authorize',
  koaOAuth2Server.authorizeMiddleware({
    authenticateHandler: {
      handle(request, response) {
        return {
          username: 3,
          password: 4
        }
      }
    }}), (ctx, next) => {
  ctx.body = ctx.code;
})

router.post('/oauth2/');

router.get('/hello', (ctx) => {
  ctx.status = 200;
  ctx.body = 'hello\n';
});


app.use(router.routes());

app.listen(3000, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('app is listening on  port 3000...');
});

