//程序入口
//
var restify = require('restify');
var net = require('net');
var router = require('./route.js');
var user = require('./user.js');
var resource = require('./resource.js');
var datahandler=require('./datahandler.js');
var testPhoto=require('./testPhoto.js');

//test net
var chatServer = net.createServer();
var clientList = []; //保存客户端

chatServer.on('connection',function(client){
	//服务器向客户端输出信息，使用wirte()方法
	client.name = client.remoteAddress + ':' + client.remotePort;
	client.write('Hi!' + client.name + '!\n');	
	clientList.push(client); //每次添加一个客户端|保存
	client.on('data',function(data){
		//接收来自客户端的信息
		broadcast(data,client);
	});
	client.on('end',function(){
		//删除数组中的指定元素
		clientList.splice(clientList.indexOf(client),1);
	});
	client.on('error',function(e){
		console.log(e);
	});
  //监听用户退出
  client.on('disconnect',function(){
    console.log('%s:disconnect',client);
  });
  
  //监听用户发布聊天内容
  client.on('message',function(obj){
    chatServer.emit('message',obj);
  });
});
chatServer.listen(9090);

function broadcast(message,client){
	var cleanUp = [];

	for(var i=0;i<clientList.length;i+=1){
		if(client != clientList[i] || true){
			if(clientList[i].writable){
	
				clientList[i].write(client.name + "says" + message);
			}else{
				cleanUp.push(clientList[i]);
				clientList[i].destroy();
			}
		}
	}
  
	for(var j=0;j<cleanUp.length;j++){
		clientList.splice(clientList.indexOf(cleanUp[j],1));
	}
}
		

var server = restify.createServer();

//监听8080端口，如果监听1024以内的端口，需要root才行运行
server.listen(8080);

//根据ip地址限制访问速率
server.use(restify.throttle({
	burst : 10,
	rate : 5,
	ip : true
}));

//解析accept值
server.use(restify.acceptParser(server.acceptable));

//解析url的参数为对象
server.use(restify.queryParser());

//压缩响应数据
server.use(restify.gzipResponse());

//解析请求body中的数据
server.use(restify.bodyParser());
//server.use(bodyParser.json());

router.route(server, {
	//测试
	"test" : {
		"path" : "/",
		"method" : "get",
		"respond" : test
	},
	//注册
	"register" : {
		"path" : "/register",
		"method" : "post",
		"respond" : user.register
	},
	//登录
	"login" : {
		"path" : "/login",
		"method" : "post",
		"respond" : user.login
	},
	//资源获取
	"category" : {
		"path" : "/category",
		"method" : "post",
		"respond" : resource.category
	},
  "show" : {
    "path" : "/show",
    "method" : "get",
    "respond" : testPhoto.show
  }
});


//测试
function test(req,res,next){
	console.log('%s listening at %s', server.name, server.url);
	console.log('url:%s, params:%s, headers:%s',req.url, req.params, req.headers);
  res.json({a:1,b:[true,'ok']});
	datahandler.success(res, 'success');
	
	return next();
}

