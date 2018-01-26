// @flow

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var uuid = require('uuid');

class Client {
  clientId: string;
  clientSecret: string;
  redirectUris: ?string[];
  constructor(clientId: string, clientSecret: string, redirectUris: ?string[]) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUris = redirectUris;
  }
}

class Token {
  clientId: string;
  refreshToken: string;
  refreshTokenExpiresAt: number;
  userId: string;
  constructor(clientId, refreshToken, refreshTokenExpiresAt, userId) {
    Object.assign(this, {clientId, refreshToken, refreshTokenExpiresAt, userId});
  }
}

class User {
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  username: string;
  constructor(email, firstname, lastname, password, username) {
    Object.assign(this, {email, firstname, lastname, password, username});
  }
}

class AuthorizationCode {
  authorizationCode: string;
  expiresAt: Date;
  redirectUri: string;
  scope: ?string;
  constructor(authorizationCode: string, expiresAt: Date, redirectUri: string, scope?: string) {
    this.authorizationCode = authorizationCode;
    this.expiresAt = expiresAt;
    this.redirectUri = redirectUri;
    this.scope = scope;
  }
}

mongoose.model('OAuthTokens', new Schema({
  clientId: { type: String },
  refreshToken: { type: String },
  refreshTokenExpiresOn: { type: Date },
  userId: { type: String }
}));


mongoose.model('OAuthClients', new Schema({
  clientId: { type: String },
  clientSecret: { type: String },
  redirectUris: { type: Array }
}));

mongoose.model('OAuthUsers', new Schema({
  email: { type: String, default: '' },
  firstname: { type: String },
  lastname: { type: String },
  password: { type: String },
  username: { type: String }
}));


var OAuthTokensModel = mongoose.model('OAuthTokens');
var OAuthClientsModel = mongoose.model('OAuthClients');
var OAuthUsersModel = mongoose.model('OAuthUsers');

const TokenTable = {};
const AuthorizationCodeTable = {};

module.exports.getAccessToken = function (bearerToken:string) {
  //TODO:  JWT validation.
}

module.exports.getClient = function(clientId:string, clientSecret:string) {
  console.log('client credentials');
  return {
    id: 'someid',
    clientId,
    clientSecret,
    name: 'Cedric-Company',
    grants: ['password', 'authorization_code'],
    accessTokenLifeTime: 15 * 60,
    refreshTokenLifeTime: 30 * 24 * 60 * 60,
    redirectUris: ['http://google.com', 'http://baidu.com']
  };
}

module.exports.getRefreshToken = function (refreshToken:string)  {
  console.log('refresh token');
  return OAuthTokensModel.findOne({refreshToken});
}

module.exports.getUser = function (username:string, password:string) {
  console.log('get user');
  return {username, password};
  // return OAuthUsersModel.find({username, password});
}

module.exports.saveToken = function (token:string, client: Client, user: User) {
  console.log('save token');
  TokenTable[client.clientId+user.username] = {
    accessToken: uuid(),
    accessTokenExpiresAt: datePlusMill(new Date(), 60 * 24 * 60 * 60 * 1000),
    refreshToken: uuid(),
    refreshTokenExpiresAt: datePlusMill(new Date(), 15 * 60),
    client: client,
    user
  };
  return TokenTable[client.clientId+user.username];
  // return OAuthTokensModel.save({clientId: client._id, refreshToken, refreshTokenExpiresOn, userId: user._id});
}

module.exports.revokeToken = function (token: string) {
  console.log('revoke token');
  return OAuthTokensModel.remove({refreshToken: token});
}

module.exports.getAuthorizationCode = function (code: string) {
  return AuthorizationCodeTable[code];
}

module.exports.saveAuthorizationCode = function (code: AuthorizationCode, client: Client, user: User) {
  AuthorizationCodeTable[code.authorizationCode] = {
    authorizationCode: code.authorizationCode,
    expiresAt: code.expiresAt,
    redirectUri: code.redirectUri,
    client: {id: 'someid'},
    user: {
      username: 3,
      password: 4
    }
  };
  return AuthorizationCodeTable[code.authorizationCode];
}

module.exports.revokeAuthorizationCode = function (code: AuthorizationCode) {
  delete AuthorizationCodeTable[code.authorizationCode];
  return true;
}


function datePlusMill(date, mills) {
  return new Date(date.getTime() + mills);
}




