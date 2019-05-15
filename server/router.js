const express = require('express');
const router = express.Router();
const api = require('./api');
const multer = require("multer"); //图片上传
const fs = require('fs');

const createFolder = function(folder){
  try{
      fs.accessSync(folder); 
  }catch(e){
      fs.mkdirSync(folder);
  }  
};
const uploadFolder = './upload';
createFolder(uploadFolder);
// 通过 filename 属性定制
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
      // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
      cb(null, file.fieldname + '-' + Date.now());
  }
});
// 通过 storage 选项来对 上传行为 进行定制化
const upload = multer({ storage: storage })
router.get('/getValue', (req, res, next) => {
  api.getValue(req, res, next);
});

router.post('/setValue', (req, res, next) => {
  api.setValue(req, res, next);
});

router.get('/getArticle', (req, res, next) => {
  api.getArticle(req, res, next);
});

router.post('/setUser',(req,res,next)=>{
  api.setUser(req,res,next);
})

router.post('/userLogin',(req,res,next)=>{
  api.userLogin(req,res,next);
})

router.get('/admin/getArticleById',(req,res,next)=>{
  api.getArticleById(req,res,next);
})

router.get('/admin/getTagAll',(req,res,next)=>{
  api.getTagAll(req,res,next);
})

// router.get('/admin/getTag',(req,res,next)=>{
//   api.getTag(req,res,next);
// })

router.post('/admin/delTag',(req,res,next)=>{
  api.delTag(req,res,next);
})

router.post('/admin/updateTag',(req,res,next)=>{
  api.updateTag(req,res,next);
})

router.post('/admin/insertTag',(req,res,next)=>{
  api.insertTag(req,res,next);
})

router.post('/admin/addArticle',(req,res,next)=>{
  api.addArticle(req,res,next);
})

router.post('/admin/updateArticle',(req,res,next)=>{
  api.updateArticle(req,res,next);
})

router.post('/admin/updArticle',(req,res,next)=>{
  api.updArticle(req,res,next);
})

router.post('/admin/delArticle',(req,res,next)=>{
  api.delArticle(req,res,next);
})

router.post('/insertComments',(req,res,next)=>{
  api.insertComments(req,res,next);
})

router.post('/updateCount',(req,res,next)=>{
  api.addViewOrStart(req,res,next);
})

router.post('/uploadImg',upload.single('imgFile'),(req,res,next)=>{
  api.uploadPic(req,res,next);
})

router.get('/upload/*',(req,res,next)=>{
  api.getImg(req,res,next);
})


module.exports = router;

