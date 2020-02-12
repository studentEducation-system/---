let sqlFunc = require('./api/apiLoginRegister.js')

module.exports = (app, md5,upload) => {
    getMd5 = (password) => {
        return md5(md5(password))
    }
    judgePasswordLength = (password)=>{
        if(password.length > 20){
            return password
        }else{
            return getMd5(password)
        }
    }

    app.post('/login', (req, res) => {
        let queryCondition = req.body.username;
        let password = req.body.password;
        // console.log(password, 'songbiao')
        sqlFunc.findUser(queryCondition, (data) => {
            if (data.length > 0) {
                if (queryCondition == data[0].username && (getMd5(password) == judgePasswordLength(data[0].password))) {
                    req.session.username = queryCondition;
                    res.send(JSON.stringify({
                        statusCode: 200,
                        status: data[0].status,
                        username: data[0].username,
                        checkPass: true,
                        message: '登录成功',
                        cookie: req.sessionID,
                        avatar:data[0].avatar || ''
                    }));
                }else{
                    res.send(JSON.stringify({
                        statusCode: 200,
                        checkPass: false,
                        message: '账号或密码错误'
                    }))
                }

            } else {
                res.send(JSON.stringify({
                    statusCode: 200,
                    checkPass: false,
                    message: '账号不存在'
                }))
            }
        });


    })

    app.post('/register',(req, res) => {
        let queryCondition = {
            username: req.body.username,
            password: md5(md5(req.body.password)),
            avatar:req.body.avatar
        };
        sqlFunc.updateUser(queryCondition, (data) => {
            if (data && data.affectedRows != 0) {
                res.send(JSON.stringify({
                    statusCode: 200,
                    updated: true,
                    message: '修改成功,请重新登录'
                }));
            } else {
                res.send(JSON.stringify({
                    statusCode: 200,
                    updated: false,
                    message: '密码重复'
                }))
            }
        });


    })

    app.post('/uploading', upload.array('imgfile', 40), function(req, res) {
        let files = req.body.imgfile
        if (!files[0]) {
            res.send('error');
        } else {
            res.send('success');
        }
    
    
    
        console.log(files);
    })

    app.post('/applyCount', (req, res) => {
        let queryCondition = {
            name: req.body.name,
            number: req.body.number,
            email: req.body.email
        };
        sqlFunc.applyCount(queryCondition, (data) => {
            // console.log(data, 'houhouhou')
            if (!data.errno) {
                res.send(JSON.stringify({
                    statusCode: 200,
                    updated: true,
                    message: '申请成功，请等待管理员审核'
                }));
            } else {
                res.send(JSON.stringify({
                    statusCode: 200,
                    updated: false,
                    message: data.errno == 1062 ? '申请失败，学号重复' : '申请失败，服务器失联'
                }))
            }
        });


    })

    app.post('/judgeLogin', (req, res) => {
        let queryCondition = req.body.session;
        // console.log(queryCondition, 'hahaha')
        sqlFunc.judgeLogin(queryCondition, (data) => {
            if (data.length) {
                console.log(data, 'hohoho')
                res.send(true);
            } else {
                res.send(false)
            }
        });


    })

    app.post('/signOutLogin', (req, res) => {
        let queryCondition = req.body.session;
        // console.log(queryCondition, 'hahaha')
        sqlFunc.signOutLogin(queryCondition, (data) => {
            if (data) {
                res.send({
                    status:200,
                    result:true,
                    message:'退出成功'
                });
            } else {
                res.send({
                    status:200,
                    result:false,
                    message:'退出成功'
                })
            }
        });


    })

    app.post('/uploadAvatar', (req, res) => {
        let queryCondition = req.body.avatar;
        // console.log(queryCondition, 'hahaha')
        sqlFunc.uploadAvatar(queryCondition, (data) => {
            if (data) {
                // console.log(data, 'hohoho')
                res.send(true);
            } else {
                res.send(false)
            }
        });


    })
}