//令牌生成代码
var crypto = require('crypto');
var jwt = require('jwt-simple');

//计算MD5
function md5(content){
	var md5d = crypto.createHash('md5');

	md5d.update(content);

	return md5d.digest('hex');

}

//计算SHA1
function sha1(content){
	var sha1vo = crypto.createHash('sha1');
	
	sha1vo.update(content);

	return sha1vo.digest('hex');
}

//计算tokenid
function access_token(username,expires){
  var content = username + expires;

  var md5vo=crypto.createHash('md5');
  md5vo.update(content);

  return md5vo.digest('hex');
}

module.exports = {
	md5 : md5,
	sha1 : sha1,
  access_token : access_token
};

