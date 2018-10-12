//业务
var fs=require('fs');
var user=require('./user.js');
var db=require('./database.js');
var datahandler=require('./datahandler');

//获取用户
function getUser(req,res,next){

  var userid  = req.params.userid;
  var tokenid = req.params.tokenid;
  var exports = req.params.exports;
  
  var minRange=req.params.min;
  var maxRange=req.params.max;
  var count=req.params.count;

  user.isLogin(userid,tokenid,exports,function(success){
    if(success){
      var conn=db.connectDB;

      var randList=getRandomNum(min,max,count,userid);
      //根据范围和数量获取用户
      conn.query('SELECT * FROM user_info WHERE id IN ?',randList,function(err,results,fields){
        if(err){
          console.log('获取用户出错'+err);
          datahandler.fail(res,'搜索失败');
        }else{
          datahandler.success(res,results);
        }
        db.closeDB(conn);
      });
    }else{
      console.log('登录信息已过期');
    }
  });
}

//取随机数
function getRandomNum(min,max,count,myid) {   
  var resultList = [];

  var conn=db.connectDB;
  conn.query('SELECT 1 FROM user_info',function(err,results,fields){
    if(err){
      console.log('查找数量错误'+err);
    }else{
      var realCount = count;
      if(results.length < count){
        realCount=results.length;
      }
      while (resultList.length < realCount){
        var result = getRandomNum(min,max,myid);
        if(result){
        
          resultList.push(getRandomNum(min,max,myid));
        }      
      }
    }
  });

   return resultList;
}

function getRandomID(min,max,myid){
  var range = max - min;   
  var rand = Math.random();   

  var result=min+Math.round(rand*range);
  if(result!=myid){
    return result;
  }
  return null;
}

module.exports={
  getUser:getUser
}
