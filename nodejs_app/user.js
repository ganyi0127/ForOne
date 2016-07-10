//用户注册和登录
var moment = require('moment'); //用于处理日期的类库
var db = require('./database.js');
var datahandler = require('./datahandler.js');
var security = require('./security.js');
 
function register(req, res, next){
	//获取参数中的用户名
	var username = req.params.username;

	//获取参数中的密码
	var password = req.params.password;
  var md5pw=security.md5(password);

	if(validata(username, password) === false){
		datahandler.fail(res, 'Invalid username or password');
	}else{
		var conn = db.connectDB();
		
		//将用户名插入user表，用户名唯一
		conn.query("INSERT INTO user_info(username,password) VALUES(?,?)", [username, md5pw],function(err, results, fields){
			if (err){
				console.log('注册时数据库插入错误：' + err.code);
				db.closeDB(conn);
				//ER_DUP_ENTRY表示与唯一性冲突，意味着用户名已经存在
				if (err.code == 'ER_DUP_ENTRY'){
					datahandler.fail(res,'用户名已存在');
				}else{
					datahandler.fail(res, 'Insert user failed');
				}
			}else{
        conn.query('SELECT userid FROM user_info WHERE username = ? AND password = ?',[username,md5pw],function(err,results,fields){
          if(err){
            console.log('查找userid出错' + err.code);
            db.closeDB(conn);
          }else{
            //计算Toekn
            var userid=results[0].userid;
            var expires=moment().add(7,'days').valueOf();
            var tokenid=security.access_token(username,expires);
            console.log('userid:' + userid);
            console.log('username:' + username);
            console.log('expires:' + expires);
            console.log('tokenid:' + tokenid);

            //注册成功，插入登录信息
            conn.query('INSERT INTO user_login(userid,expires,tokenid) VALUES(?,?,?)',[userid,expires,tokenid],function(err,results,fields){
                if(err){
                  console.log('为已登录用户保存登录信息出错' + err.code);
                  datahandler.fail(res,'保存注册信息出错');
                  db.closeDB(conn);
                }else{
                  console.log('为新注册用户保存登录信息成功');
                  datahandler.success(res,{
                    userid : userid,
                    tokenid : tokenid
                  });
                  db.closeDB(conn);
                }                  
            });
          }
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
	if (validata(username, password) === false){
		datahandler.fail(res, 'Invalid username or password');
	}else{
		//连接数据库
		var conn = db.connectDB();
		//查询username对应的uid
		var md5pw = security.md5(password);

    //查找用户登录帐号密码是否正确
		conn.query('SELECT userid FROM user_info WHERE username = ? AND password = ?', [username, md5pw], function(err, results, fields){
			if (err){
				console.log('登录时查询用户出错:' + err.code);
				db.closeDB(conn);
			
				datahandler.fail(res, 'Server internal error');
			}else{
				if (results.length === 0){
					db.closeDB(conn);
					datahandler.fail(res,'Username or password error');
				}else{
					var userId = results[0].userid;
					var expires = moment().add(7, 'days').valueOf();
					//计算Token
          var access_token=security.access_token(username,expires); 
          
          console.log('userId: %s, expires: %s, access_token: %s',userId, expires, access_token);
					
          //登录成功，插入登录信息
          conn.query('INSERT user_login(userid,expires,tokenid) VALUES(?,?,?)',[userId,expires,access_token],function(err,results,fields){

            if(err){
              console.log(err);

              //如果报错为'ER_DUP_ENTRY'说明已经存在该userid的数据，则直接更新expires,tokenid
              if(err.code=='ER_DUP_ENTRY'){
                console.log('为已登录用户保存登录信息成功');              
                //登录成功，更新登录信息
                conn.query('UPDATE user_login SET tokenid = ?, expires = ? WHERE userid = ?', [access_token,expires,userId],function(err, results, fields){
                  if (err){
                    console.log(err);
                    datahandler.fail(res,'Login internal error');
                  }else{
                    //返回登录结果，可以根据需要增加其他信息
                    datahandler.success(res,{
                      userid : userId,
                      tokenid :access_token
                    });
                  }
                  db.closeDB(conn);
                  });

              }else{
                //无报错说明已经插入登录信息
                db.closeDB(conn);
                datahandler.fail(res,'insert user_login error'); 
              }
            }else{
              
              db.closeDB(conn);
              datahandler.success(res,{
                userid : userId,
                tokenid : access_token
              });
            }
          });
        }
			}
		});
	}

	return next();
}

//验证是否上传了用户名和密码
function validata(username, password){
	if (username == "undefined"){
		return false;
	}else{
		return true;
	}
}

function isLogin(userid, access_token, expires, completion){
	var conn = db.connectDB();
	
	//每次访问其他资源时，都需要获取userId, access_token, exipres等
  console.log('expires:' + expires);
	conn.query('SELECT * FROM user_login WHERE userid = ? AND tokenid = ? AND expires > ?',[userid, access_token, expires],function(err,results, fields){
		if (err){
			console.log('isLogin error:' + err);
      completion(false);
		}else{
			console.log(results);
			if (results.length > 0){
				completion(true);
			}else{
        datahandler.fail(res, '登陆信息已过期');
				completion(false);
      }
    }
		db.closeDB(conn);
	});
}

module.exports = {
  register:register,
  login:login,
  isLogin:isLogin
};
