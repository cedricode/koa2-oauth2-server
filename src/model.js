var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

module.exports.getAccessToken = function (bearerToken) {
  //TODO:  JWT validation.
}

module.exports.getClient = function(clientId, clientSecret) {
  // TODO: return applibrary
}

module.exports.getRefreshToken = function (refreshToken)  {
  return OAuthTokensModel.findOne({refreshToken});
}

module.exports.getUser = function (username, password) {
  return OAuthUsersModel.find({username, password});
}

module.exports.saveToken = function (token, client, uesr) {
  return OAuthTokensModel.save({clientId: client._id, refreshToken, refreshTokenExpiresOn, userId: user._id});
}

module.exports.revokeToken = function (token) {
  return OAuthTokensModel.remove({refreshToken: token});
}





