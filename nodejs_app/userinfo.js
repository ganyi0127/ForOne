//用户个人信息
var moment=require('moment');
var user=require('./user.js');
var db=require('./database.js');
var datahandler=require('./datahandler.js');

//更新个人信息
function setBaseinfo(req,res,next){
  //获取参数
  console.log(req);
  var nickname=req.params.nickname;
  var sex=req.params.sex;
  var age=req.params.age;
  var location=req.params.location;
  var constellation=req.params.constellation;
  var height=req.params.height;
  var weight=req.params.weight;
  var bloodtype=req.params.bloodtype;
  var telephone=req.params.telephone;
  var personality=req.params.personality;

  //获取验证参数
  var userid=req.params.userid;
  var tokenid=req.params.tokenid;
  var expires=moment().valueOf();

  user.isLogin(userid, tokenid,expires,function(success){
    console.log('login=' + success);
    if(success){
      var conn=db.connectDB();

      //插入修改后的个人信息
      conn.query('UPDATE user_info SET nickname = ? , sex = ?, age = ?, location = ?, constellation = ?, height = ?, weight = ?, bloodtype = ?, telephone = ?, personality = ? WHERE userid = ?', [nickname ,sex,age,location,constellation,height,weight,bloodtype,telephone,personality,userid],function(err,results,fields){
        
        if(err){
          console.log('更新用户信息出错'+err);
          if(err.code == 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD'){
            datahandler.fail(res,'非法输入');
          }else{

            datahandler.fail(res, '更新失败');
          }
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
