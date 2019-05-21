const mysql = require('mysql');
const dbConfig = require('./db');
const sqlMap = require('./sqlMap');
const marked = require('marked');
const jwt = require('jsonwebtoken');  //用来生成token

const pool = mysql.createPool({
  host: dbConfig.mysql.host,
  user: dbConfig.mysql.user,
  password: dbConfig.mysql.password,
  database: dbConfig.mysql.database,
  port: dbConfig.mysql.port,
  multipleStatements: true    // 多语句查询
});

module.exports = {

  getValue(req, res, next) {
    var id = req.query.id;
    pool.getConnection((err, connection) => {
      var sql = sqlMap.getValue;
      connection.query(sql, [id], (err, result) => {
        res.json(result);
        connection.release();
      })
    })
  },
  setValue(req, res, next) {
    var id = req.body.id, name = req.body.name;
    pool.getConnection((err, connection) => {

      var sql = sqlMap.setValue;
      connection.query(sql, [name, id], (err, result) => {
        res.json(result);
        connection.release();//归还资源 
      })
    })
  },
  // 注册
  setUser(req, res, next) {
    pool.getConnection((err, connection) => {
      let postData = req.body;
      connection.query(sqlMap.user.queryUsername, [postData.username], (err, result) => {
        if (result.length !== 0) {
          res.json({
            status: false,
            msg: '用户已存在'
          });
          connection.release();
        } else {
          let username = postData.username, password = postData.password;
          connection.query(sqlMap.user.insert, [username, password], (err, result) => {
            let status = true, msg = '注册成功';
            if (err) {
              status = false;
              msg = '服务器出错,请稍后再试';
            }
            res.json({
              status: status,
              msg: msg
            });
            connection.release();
          })
        }
      })
    })
  },
  // 登陆
  userLogin(req, res, next) {
    pool.getConnection((err, connection) => {
      // console.log(connection)
      let postData = req.body;
      let content = { name: req.body.name }; // 要生成token的主题信息
      let secretOrPrivateKey = "jwt";// 这是加密的key（密钥）
      let token = jwt.sign(content, secretOrPrivateKey, {
        expiresIn: 60 * 60 * 1  // 1小时过期
      });
      connection.query(sqlMap.user.queryUsername, [postData.username], (err, result) => {
        if (result.length === 0) {
          res.json({
            status: false,
            msg: '用户不存在'
          });
        } else {
          if (result[0].password !== postData.password) {
            res.json({
              status: false,
              msg: '密码错误'
            });
          } else {
            res.json({
              status: true,
              msg: '登录成功',
              token: token
            });

          }
        }
        connection.release()
      })
    })
  },
  // 标签
  getTagAll(req, res, next) {
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.tag.queryAll, (err, result) => {
        res.json(result);
        connection.release();
      })
    })
  },
  // getTag(req, res, next) {
  //   pool.getConnection((err, connection) => {
  //     connection.query(sqlMap.tag.queryById, (err, result) => {
  //       res.json(result);
  //       connection.release();
  //     })
  //   })
  // },
  delTag(req, res, next) {
    pool.getConnection((err, connection) => {
      let postData = req.body;
      connection.query(sqlMap.tag.delById, [postData.name], (err, result) => {
        res.json({
          status: true,
          msg: '删除成功'
        })
        connection.release();
      })
    })
  },
  updateTag(req, res, next) {
    pool.getConnection((err, connection) => {
      let postData = req.body;
      connection.query(sqlMap.tag.updateById, (err, result) => {
        res.json(result);
        connection.release();
      })
    })
  },
  insertTag(req, res, next) {
    pool.getConnection((err, connection) => {
      let postData = req.body;
      connection.query(sqlMap.tag.queryByName, [postData.name], (err, result) => {
        if (result.length > 0) {
          res.json({
            status: false,
            msg: '标签，名字已经存在',
          });
          connection.release();
        } else {
          connection.query(sqlMap.tag.insert, [postData.name], (err, result) => {
            res.json({
              status: true,
              msg: '添加成功'
            });
            connection.release();
          })
          // connection.release();
        }
      })
    })
  },
  getArticleById(req, res, next) {
    let postData = req.query;
    pool.getConnection((err, connection) => {
      connection.query(sqlMap.tag.queryById, [postData.id], (err, result) => {
        res.json(result);
        connection.release();
      })
    })
  },
  // 上传图片
  uploadPic(req, res, next) {
    let file = req.file,
      url = '/api/upload/' + file.filename;  
      // 'http://' + req.headers.host + 
    res.send({ resultCode: '1', url });
  },
  // 读取图片
  getImg(req, res, next) {
    res.sendFile(__dirname + "/" + req.url);
  },
  // 新增文章
  addArticle(req, res, next) {
    pool.getConnection((err, connection) => {
      let postData = req.body,
        creat_at = new Date().getTime(),
        title = postData.title;
      connection.query(sqlMap.article.queryByTitle, [title], (err, result) => {
        if (result.length > 0) {
          res.json({
            status: false,
            msg: '文章标题已存在',
          });
          connection.release();
        } else {
          connection.query(sqlMap.article.insert, [postData.username, title, postData.content, postData.html, postData.tags, creat_at, 0, 0, postData.state], (err, result) => {
            if (err !== null) {
              res.json({
                status: false,
                msg: '添加失败',
              });
            } else {
              res.json({
                status: true,
                msg: '添加成功',
              });
            }
            connection.release();
          })
        }
      })
    })
  },
  //所有文章
  getArticle(req, res, next) {
    pool.getConnection((err, connection) => {

      let postData = req.query;//get请求参数在query里
      let pageNum = parseInt(postData.pageNum || 1);// 页码
      let end = parseInt(postData.pageSize || 5); // 默认页数
      let start = (pageNum - 1) * end;
      if (postData.username !== undefined && postData.pageNum !== undefined) {
        connection.query(sqlMap.article.queryAllBysu, [postData.state, postData.username, start, end], (err, result) => {
          res.json(result);
        })
      } else if (postData.pageNum == undefined) {
        connection.query(sqlMap.article.queryAllBySU, [postData.state, postData.username], (err, result) => {
          res.json(result);
        })
      } else {
        connection.query(sqlMap.article.queryAll, [postData.state, start, end], (err, result) => {
          res.json(result);
        })
      }
      connection.release();
    })
  },
  // 阅读量、点赞量 +1
  addViewOrStart(req, res, next) {
    pool.getConnection((err, connection) => {
      let postData = req.body;
      connection.query(sqlMap.article.updateViewCount, [postData.view, postData.count, postData.id], (err, result) => {
        res.send('ok');
      })
    })
    connection.release()
  },
  //改变文章状态
  updateArticle(req, res, next) {
    pool.getConnection((err, connection) => {
      let postData = req.body;
      connection.query(sqlMap.article.updById, [postData.state, postData.id], (err, result) => {
        if (err !== null) {
          res.json({
            status: false,
            msg: '编辑失败',
          });
        } else {
          res.json({
            status: true,
            msg: '编辑成功',
          });
        }
        connection.release();
      })
    })
  },
  //编辑文章
  updArticle(req, res, next) {
    pool.getConnection((err, connection) => {
      let postData = req.body;
      connection.query(sqlMap.article.updAllById, [postData.state, postData.title, postData.tags, postData.content, postData.id], (err, result) => {
        if (err !== null) {
          res.json({
            status: false,
            msg: '编辑失败',
          });
        } else {
          res.json({
            status: true,
            msg: '编辑成功',
          });
        }
        connection.release();
      })
    })
  },
  //删除文章
  delArticle(req, res, next) {
    pool.getConnection((err, connection) => {
      let postData = req.body;
      connection.query(sqlMap.article.delById, [postData.id], (err, result) => {
        if (err !== null) {
          res.json({
            status: false,
            msg: '删除失败',
          });
        } else {
          res.json({
            status: true,
            msg: '删除成功',
          });
        }
        connection.release();
      })
    })
  },
  //添加评论
  insertComments(req, res, next) {
    pool.getConnection((err, connection) => {
      let postData = req.body;
      connection.query(sqlMap.article.insertComment, [postData.comments, postData.id], (err, result) => {
        if (err) {
          res.json({
            status: false,
            msg: '添加失败'
          });
          console.log(err)
        } else {
          res.json({
            status: true,
            msg: '添加成功'
          });
        }
      })
      connection.release();
    })
  },
}
