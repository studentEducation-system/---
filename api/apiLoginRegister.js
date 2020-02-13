let mysql = require('./index.js')
function findUser(sqlWord,callback){
    let connection = mysql();
    connection.query("select * from userlogin where username = '" + sqlWord + "'",(err,data)=>{
        if(err){
            console.log(err)
            callback(err)
        }else{
            callback(data)
        }
    })
    connection.end()


}

function updateUser(sqlWord,callback){
    let connection = mysql();
    let query = '';
    if(sqlWord.avatar){
        query = "update userlogin set password = '" + sqlWord.password + "', avatar = '"+ sqlWord.avatar +"' where username = '" + sqlWord.username + "'"
    }else{
        query = "update userlogin set password = '" + sqlWord.password + "' where username = '" + sqlWord.username + "'"
    }
    connection.query(query,(err,data)=>{
        if(err){
            console.log(err)
            callback(err)
        }else{ 
            callback(data)
        }
    })
    connection.end()
}

function applyCount(sqlWord,callback){
    let connection = mysql();
    connection.query("insert into userapply(name,number,email) values('"+sqlWord.name+"','"+sqlWord.number+"','"+sqlWord.email+"')",(err,data)=>{
        if(err){
            callback(err)
        }else{ 
            callback(data)
        }
    })
    connection.end()
}

function judgeLogin(sqlWord,callback){
    let connection = mysql();
    connection.query("select * from session_tab where session_id = '" + sqlWord + "'",(err,data)=>{
        if(err){
            callback(err)
        }else{ 
            callback(data)
        }
    })
    connection.end()
}

function signOutLogin(sqlWord,callback){
    let connection = mysql();
    connection.query("delete from session_tab where session_id = '" + sqlWord + "'",(err,data)=>{
        if(err){
            callback(err)
        }else{ 
            callback(data)
        }
    })
    connection.end()
}

// function uploadAvatar(sqlWord,callback){
//     let connection = mysql();
//     connection.query("insert into userlogin(avatar) values('"+ sqlWord +"') ",(err,data)=>{
//         if(err){
//             callback(err)
//         }else{ 
//             callback(data)
//         }
//     })
//     connection.end()
// }

module.exports = {
    findUser,
    updateUser,
    applyCount,
    judgeLogin,
    signOutLogin,
}