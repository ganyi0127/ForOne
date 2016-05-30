//用户注册和登录
var moment = require('moment');
var db = require('./database.js');
var datahandler = require('./datahandler.js');
var security = require('./security.js');
 
function register(req, res, next){
	//获取参数中的用户名
	var username = req.params.username;

	//获取参数中的密码
	var password = req.params.password;

	if (validata(username, password) == false){
		datahandler.fail(res, 'Invalid username or password');
	}else{
		var conn = db.connectDB();
		
		//将用户名插入user表，用户名唯一
		conn.query("INSERT INTO user(name) VALUES(?)", username, function(err, results, fields){
			if (err){
				console.log('注册时数据库插入错误：' + err.code);
				db.closeDB(conn);
				//ER_DUP_ENTRY表示与唯一性冲突，意味着用户名已经存在
				if (err.code == 'ER_DUP_ENTRY'){
					datahandler.fail(res, username + 'exists');
				}else{
					datahandler.fail(res, 'Insert user failed');
				}
			}else{
				//获取最后插入的数据的ID，即上面INSERT代码插入的用户uid
				var userId = results.insertId;
				//计算密码的MD5，可以考虑通过加salt提高安全性
				var md5 = security.md5(password);

				//将uid和password插入localAuth
				conn.query('INSERT INTO localAuth (uid, username, password) VALUES(?,?,?)', [userId, username, md5], function(err,results, field){
					if (err){
						console.log(err);
						datahandler.fail(res, 'Insert localAuth failed');
					}else{
						datahandler.success(res, {
							name : username,
							userId : userId
						});
					}

					db.closeDB(conn);
				});
			}
		});
	}
	
	return next();

}

function login(req, res, next){

	//获取POST通过Body发送的用户名和密码，应该考虑加密后发送
	//{'username':'abc','password':'xyz'}
	var username = req.params.username;
	var password = req.params.password;

	//检查参数合法性
	if (validata(username, password) == false){
		datahandler.fail(res, 'Invalid username or password');
	}else{
		//连接数据库
		var conn = db.connectDB();
		//查询username对应的uid
		var md5 = security.md5(password);

		//简化的登陆流程，username在localAuth中有一份数据，因此不需要查询user表
		conn.query('SELECT uid FROM localAuth WHERE username = ? AND password = ?', [username, md5], function(err, results, fields){
			if (err){
				console.log('登录时查询用户出错:' + err.code);
				db.closeDB(conn);
			
				datahandler.fail(res, 'Server internal error');
			}else{
				if (results.length == 0){
					db.closeDB(conn);
					datahandler.fail(res,'Username or password error');
				}else{
					var userId = results[0].uid;
					var expires = moment().add(7, 'days').valueOf();
					//计算Token
					var access_token = security.access_token(username,expires);
					
					//登录成功，保存登录信息
					conn.query('UPDATE localAuth SET access_token = ?, expires = ? WHERE uid = ?', [access_token,expires,userId],function(err, results, fields){
						if (err){
							console.log(err);
							datahandler.fail(res,'Login internal error');
						}else{
							//返回登录结果，可以根据需要增加其他信息
							datahandler.success(res,{
								userId : userid,
								expires : expires,
								access_token :access_token
							});
						}
						db.closeDB(conn);
					});
				}
			}
		});
	}

	return next();
}

exports.register = register;
exports.login = login;

//验证是否上传了用户名和密码
function validata(username, password){
	if (typeof(username) == "undefined"){
		return false;
	}else{
		return true;
	}
}

function isLogin(userId, access_token, expires, completion){
	var conn = db.connectDB();
	
	//每次访问其他资源时，都需要获取userId, access_token, exipres等
	conn.query('SELECT 1 FROM localAuth WHERE uid = ? AND access_token = ? AND expires > ?',[userId, access_token, expires],function(err,results, fields){
		if (err){
			console.log('DB failed');
			completion(false);
		}else{
			console.log(results);
			if (results.length > 0){
				completion(true);
			}else{
				completion(false);
				}
				}
		db.closeDB(conn);
	});
}
