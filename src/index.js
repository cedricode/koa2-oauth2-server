// @flow
var Koa = require('koa');
var bodyParser = require('koa-bodyparser');
var OAuth2Server = require('oauth2-server');

var KoaRouter = require('koa-router');

class KoaOAuth2Server {
  OAuth2Server: OAuth2Server;
  constructor(options) {
    this.OAuth2Server = new OAuth2Server(options);
  }

  authenticateMiddleware() {
    return function authenticate(ctx, next) {
      const request = new OAuth2Server.Request(ctx.request);
      const response = new OAuth2Server.Response(ctx.response);
      return this.OAuth2Server.authenticate(request, response);
    }
  }

  token() {
    return async function token(ctx, next) {
      const request = new OAuth2Server.Request(ctx.request);
      const response = new OAuth2Server.Response(ctx.response);
      return this.OAuth2Server.token(request, response);
    }
  }
}

const koaOAuth2Server = new KoaOAuth2Server({model: TODO:});

const router = new KoaRouter();

router.post('/oauth2/token', koaOAuth2Server.token());

router.post('/oauth2/')
