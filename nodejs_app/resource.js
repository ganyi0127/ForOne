//资源获取接口代码
var moment=require('moment');
var db = require('./database.js');
var datahandler = require('./datahandler.js');
var user = require('./user.js');

function category(req, res, next){
	var userId = req.params.userId;
	var access_token = req.params.access_token;
	var expires = moment(); 
	
	console.log(req.params);

	//获取资源之前判断是否为认证用户
	user.isLogin(userId, access_token, expires, function(success){
		if (success){
			var conn = db.connectDB();
			//获取资源
			conn.query('SELECT username FROM user_info',function(err, results, fields){
				if (err){
					datahandler.fail(res, 'Select category error');
				}else{
					datahandler.success(res, results);
				}
				
				db.closeDB(conn);
			});
		}else{
      console.log('登录信息已过期');
		}
	});

	return next();
}

exports.category = category;
