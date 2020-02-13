let express = require('express');
let app = express();
const cors = require('cors');
const bodyParser = require('body-parser');//获取post请求参数插件
const router = require('./router.js');
const mysql = require('./api/index.js');
const session=require("express-session");
const MySQLStore=require('express-mysql-session')(session);
const md5 = require('blueimp-md5')
let url = require('url')

let multer = require("multer");
let storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
       let url1 = url.parse(req.url, true).query.username
        
        cb(null, `${url1}-${file.originalname}`)
    }
})
let upload = multer({ storage: storage });
app.use(express.static('dist'));
//let cpUpload = upload.fields([{ name: 'imgfile', maxCount: 12 }])



const sqlConnect = mysql();
let sessionStore = new MySQLStore({
    expiration: 10800000,
    createDatabaseTable: true,  //是否创建表
    schema: {
        tableName: 'session_tab',   //表名
        columnNames: {      //列选项
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
}, sqlConnect);

app.use(session({
    key: 'connect-sid',
    secret: "keyboard",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: ('name', 'value',{  maxAge:  60*60*1000,
                                secure: false,
                                name: "seName",
                                resave: false})
}));

app.use(bodyParser.json());//数据JSON类型
app.use(bodyParser.urlencoded({ extended: false }));//解析post请求数据
app.use(cors()); //cors解决跨域


router(app,md5,upload)

app.listen('12306', () => {
    console.log('服务器已经启动')
})