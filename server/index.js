const routerApi = require('./router');
const bodyParser = require('body-parser'); // post 数据是需要
const express = require('express');
const app = express();
// const cors = require('cors');

// app.use(cors());
app.use(express.static('public'));
// app.use(express.static(path.join(__dirname, 'public')));
// console.log(express.static('public'));
app.use(bodyParser.json());

// 后端api路由
app.use('/api', routerApi);

// 监听端口
app.listen(3000);
console.log('success listen at port:3000......');