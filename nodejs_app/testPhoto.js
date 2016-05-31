var fs=require('fs');
var datahandler=require('./datahandler.js');

function show(req,res,next){
  console.log('show photo begin!');
  fs.readFile('./headphoto/014.jpg','binary',function(error,file){
    if (error){
      datahandler.fail(res,error); 
    }else{
      res.writeHead(200,{'Content-Type':'image/jpeg'});
      res.write(file,'binary');
      datahandler.success(res,{
      });
    } 
 });
}

module.exports={
  show:show
};
