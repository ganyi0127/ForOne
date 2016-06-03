//数据库操作代码
var mysql = require('mysql');
var crypte = require('crypto');

function connectDB(){
	//1.创建数据库连接
	var conn = mysql.createConnection({
		host : 'localhost',
		port : '3306',
		user : 'root',
    password : '123'
  });

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
