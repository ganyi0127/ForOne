var fs=require('fs');
var datahandler=require('./datahandler.js');

function getPhoto(req,res,next){
 // fs.readFile('./headphoto/014.jpg','binary',function(error,file){
 //   console.log('error:'+error+'\nfile:'+file);
 //   if (error){
 //     datahandler.fail(res,error); 
 //   }else{
 //     res.writeHead(200,{'Content-Type':'image/jpeg'});
 //     res.write(file,'binary');
 //     datahandler.success(res,{
 //     });
 //   } 
 //});
  
  //var headphoto=req.params.headphoto;
  //var path = './headphoto/fo'+headphoto+'.png';
  var path = './headphoto/011.png';
  fs.exists(path,function(exists){
    if(exists){
      var rOption={
        fd:'userHeadPhoto',
        encoding:null,
      };
      var wOption={
        flags:'w',
        encoding:'utf8',
      };

      var fileReadStream=fs.createReadStream(path,rOption);

      fileReadStream.pipe(res);

      fileReadStream.on('end',function(){
        console.log('获取'+headphoto+'头像完成');
        res.end();
      });
      //var fileWriteStream=fs.createWriteStream('./headphoto/test.png',wOption);

      //fileReadStream.pipe(fileWriteStream);

      //fileReadStream.on('data',function(data){
      //  if(!res.write(data)){
      //    fileReadStream.pause();
      //  }
      //});

      //res.on('drain',function(){
      //  fileReadStream.resume();
      //});

      //fileReadStream.pipe(res);

      //fileReadStream.on('error',function(){
      //  console.log('error' + error);
      //  res.end();
      //});

      //fileReadStream.on('end',function(){
      //  console.log('readStream end');
      //  res.end();
      //});

    }else{
      console.log(path + '不存在');
    }
  });

}

function setPhoto(req,res,next){
  for(var obj in req.params){
    console.log('obj:' + obj);
  }
  console.log('userid:' + headphoto + '\nimageData:' + data);
  //fs.writeFile('./headphoto/fo'+userid+'.png','binary',function(error,file){
  //  if(error){
  //    datahandler.fail(res,error);
  //  }else{
  //    datahandler.success(res,{});
  //  }
  //});
  var path='./headphoto/fo'+headphoto+'.png';
  //fs.appendFile(path,data,{flags:'a',encoding:'utf8'},function(error){
  //  if(error){
  //    datahandler.fail(res,'保存失败');
  //  }else{
  //    datahandler.success(res,{});
  //  }
  //});
  fs.writeFile(path, data, "binary", function(err){
    if(err){
      console.log("down fail");
      datahandler.fail(res,'上传失败');
    }else{
      console.log("down success");
      datahandler.success(res,{
        filename:'fo'+headphoto+'.png'
      });
    }
  });
}

module.exports={
  getPhoto:getPhoto,
  setPhoto:setPhoto
};

