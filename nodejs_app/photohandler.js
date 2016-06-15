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
  var path = './headphoto/' + req.params.name;
  fs.exists(path,function(exists){
    if(exists){
      var rOption={
        flags:'r',
        fd:null,
        encoding:'binary',
        mode:0666,
        autoClose:true
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

      //datahandler.success(res,{message:'getImageSuccess!'});

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

      res.on('end',function(){
        console.log('res: end');
      });

      fileReadStream.on('error',function(){
        console.log('error' + error);
        res.end();
      });

    }else{
      console.log(path + '不存在');
      datahandler.fail(res,'file not exists!');
    }
  });

}

function setPhoto(req,res,next){
  var data = req.body;
  var headphoto = req.params.userid;
  console.log('userid:' + headphoto + '\nimageData:' + data);
  var path='./headphoto/fo'+headphoto+'.png';
  fs.writeFile(path, data, "utf8", function(err){
    if(err){
      console.log("down fail");
      datahandler.fail(res,'上传失败');
    }else{
      console.log("down success");
      datahandler.success(res,{
        photoname:'fo'+headphoto+'.png'
      });
    }
  });
}

module.exports={
  getPhoto:getPhoto,
  setPhoto:setPhoto
};

