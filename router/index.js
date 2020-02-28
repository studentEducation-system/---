let loginRouter = require('./loginRouter.js');
let resumeRouter = require('./resumeRouter.js');

module.exports = (app, md5, upload,dirname)=>{
    loginRouter(app, md5, upload,dirname);
    resumeRouter(app, md5, upload)
}