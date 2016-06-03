//路由代码
function route(server, url_map){
	
	console.log('URL 路由');
	console.log('server: %s', server);
	console.log('urlMap: %s', url_map);

	for (var name in url_map){
		config = url_map[name];
		path = config.path;
		method = config.method;
		respond = config.respond;
		server[method](path, respond);
		console.log('name------%s',name);
	}
}
exports.route = route;
