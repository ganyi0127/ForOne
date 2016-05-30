//程序入口
var restify = require('restify');
var net = require('net');
var router = require('./route.js');
var user = require('./user.js');
var resource = require('./resource.js');


//test net
var chatServer = net.createServer();
var clientList = [];

chatServer.on('connection',function(client){
	//服务器向客户端输出信息，使用wirte()方法
	client.name = client.remoteAddress + ':' + client.remotePort;
	client.write('Hi!' + client.name + '!\n');	
	clientList.push(client);
	client.on('data',function(data){
		//接收来自客户端的信息
		broadcast(data,client);
	});
	client.on('end',function(){
		//删除数组中的指定元素
		clientList.splice(clientList.indexOf(client),1);
	})
	client.on('error',function(e){
		console.log(e);
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
				cleanUp.push(clientList[i])
				clientList[i].destroy();
			}
		}
	}

	for(var i=0;i<cleanUp.length;i++){
		clientList.splice(clientList.indexOf(cleanUp[i],1));
	}
}
		

var server = restify.createServer();

//监听8080端口，如果监听1024以内的端口，需要root才行运行
server.listen(8080);

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
	}
});

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


//测试
function test(req,res,next){
	console.log('%s listening at %s', server.name, server.url);
	console.log('url:%s, params:%s, headers:%s',req.url, req.params, req.headers);
	
	datahandler.success(res, 'success');
	
	return next();
}

