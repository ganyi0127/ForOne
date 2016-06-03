//数据库操作代码
var mysql = require('mysql');
var crypte = require('crypto');

function connectDB(){
	//1.创建数据库连接
	var conn = mysql.createConnection({
		host : 'localhost',
		port : '3306',
		user : 'root',
<<<<<<< HEAD
		password : '123456'
	});
=======
    password : '123'
  });
>>>>>>> 2fa23c90ffdfdec55ba6ee9df74403bdcd410c9a

	//2.执行SQL语句，使用FSTMB数据库
	conn.query('USE foronedb');

	return conn;
}

function closeDB(conn){
	//3.关闭数据库连接
	conn.end();
}

exports.connectDB = connectDB;
exports.closeDB = closeDB;
