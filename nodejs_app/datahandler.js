//发送响应数据的代码
function sendSuccess(res, result){

	res.send({
		result : true,
		data : result
	});
}

function sendFailed(res, reason){
	
	res.send({
		result : false,
		reason : reason
	});
}

exports.success = sendSuccess;
exports.fail = sendFailed;
