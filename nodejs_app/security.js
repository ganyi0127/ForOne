//令牌生成代码
var crypte = require('crypto');
var jwt = require('jwt-simple');

//计算MD5
function md5(content){
	var md5 = crypto.createHash('md5');

	md5.update(content);

	return md5.digest('hex');

}

//计算SHA1
function sha1(content){
	var sha1 = crypto.createHash('sha1');
	
	sha1.update(content);

	return sha1.digest('hex');
}

module.exports = {
	md5 : md5,
	sha1 : sha1
};
