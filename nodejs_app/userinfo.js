//用户个人信息
var moment=require('moment');
var user=require('./user.js');
var db=require('./database.js');
var datahandler=require('./datahandler.js');

//更新个人信息
function setBaseinfo(req,res,next){
  //获取参数
  var nickname=req.param.username;
  var sex=req.param.sex;
  var age=req.param.age;
  var location=req.param.location;
  var constellation=req.param.constellation;
  var height=req.param.height;
  var weight=req.param.weight;
  var bloodtype=req.param.bloodtype;
  var telephone=req.param.telephone;
  var personality=req.param.personality;

  //获取验证参数
  var userid=req.param.userid;
  var tokenid=req.param.tokenid;
  var expires=moment();

  user.isLogin(userid, tokenid,expires,function(success){
    if(success){
      var conn=db.connectDB();

      //插入修改后的个人信息
      conn.query('UPDATE user_info SET nickname = ? , sex = ?, age = ?, location = ?, constellation = ?, height = ?, weight = ?, bloodtype = ?, telephone = ?, personality = ? WHERE tokenid = ?', [nickname ,sex,age,location,constellation,height,weight,bloodtype,telephone,personality,tokenid],function(err,results,fields){
        
        if(err){
          console.log('更新用户信息出错'+err);
          datahandler.fail(res, '更新失败');
        }else{
          datahandler.success(res,results);
        }
        db.closeDB(conn);
      });
    }else{
      console.log('登录信息已过期');
    }
  });
  return next();
}

//获取个人信息
function getBaseinfo(req,res,next){
  //获取参数
  var userid=req.param.userid;
  var tokenid=req.param.tokenid;
  var expires=moment();

  user.isLogin(userid,tokenid,expires,function(success){
    if(success){
      var conn=db.connectDB();

      //获取个人信息
      conn.query('SELECT 1 FROM user_info WHERE userid=?',userid,function(err,results,fields){

        if(err){
          console.log('获取用户信息出错'+err);
          datahandler.fail(res,'获取失败');
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

module.exports={
  setBaseinfo:setBaseinfo,
  getBaseinfo:getBaseinfo
};
