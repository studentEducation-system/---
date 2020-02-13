let sqlFunc = require('./api/apiLoginRegister.js')
let fs = require('fs');
let url = require('url')

module.exports = (app, md5, upload) => {
    getMd5 = (password) => {
        return md5(md5(password))
    }
    judgePasswordLength = (password) => {
        if (password.length > 20) {
            return password
        } else {
            return getMd5(password)
        }
    }

    app.post('/login', (req, res) => {
        let queryCondition = req.body.username;
        let password = req.body.password;
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
                        avatar: data[0].avatar || ''
                    }));
                } else {
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

    app.post('/register', upload.array('imgfile', 40), (req, res) => {
        let queryCondition = {
            username: req.body.username,
            password: md5(md5(req.body.password)),
            avatar:req.files[0]&&req.files[0].filename? req.files[0].filename : ''
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
        
        sqlFunc.findUser(queryCondition.username, (data) => {
            if (data.length) {
                let avatar = data[0].avatar;
                if (avatar) {
                fs.readdir('./uploads/', function (err, files) {
                        let filterFile = files.filter((ele)=>{
                            return ele.indexOf(queryCondition.username) == 0 && ele != avatar;

                        })
                        filterFile.forEach((ele) => {
                            if(ele!=''){
                                fs.unlink('./uploads/'+ ele, (err) => {
                                    if (err) {
                                        console.log(err);
                                        res.send({
                                            message:'服务器错误，头像上传失败'
                                        })
                                    } else {
                                        console.log('已经删除')
                                    }
                                })
                            }
                            
                        })
                    });
                }
            }
        })
      


    })

    app.get('/getAvatar', function (req, res) {
        const username = url.parse(req.url, true).query.username;

        sqlFunc.findUser(username, (data) => {
            if (data.length) {
                let avatar = data[0].avatar;
                if (avatar) {
                    res.sendFile(__dirname + '/uploads/' + avatar)
                }
            }
        })

    })

    app.post('/applyCount', (req, res) => {
        let queryCondition = {
            name: req.body.name,
            number: req.body.number,
            email: req.body.email
        };
        sqlFunc.applyCount(queryCondition, (data) => {
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
        sqlFunc.judgeLogin(queryCondition, (data) => {
            if (data.length) {
                res.send(true);
            } else {
                res.send(false)
            }
        });


    })

    app.post('/signOutLogin', (req, res) => {
        let queryCondition = req.body.session;
        sqlFunc.signOutLogin(queryCondition, (data) => {
            if (data) {
                res.send({
                    status: 200,
                    result: true,
                    message: '退出成功'
                });
            } else {
                res.send({
                    status: 200,
                    result: false,
                    message: '退出成功'
                })
            }
        });


    })

    // app.post('/uploadAvatar', (req, res) => {
    //     let queryCondition = req.body.avatar;
    //     sqlFunc.uploadAvatar(queryCondition, (data) => {
    //         if (data) {
    //             res.send(true);
    //         } else {
    //             res.send(false)
    //         }
    //     });


    // })
}