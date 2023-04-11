var config = require('../configs/config');
//create token and saving in cookie
var sendToken = (taikhoan,statusCode,res)=>{
    var token = taikhoan.getJWT();

    var options = {
        expires:new Date(
            Date.now() + config.COOKIE_EXPIRE * 24 *60 *60 *1000
        ),
        httpOnly:true,
    };
    res.status(statusCode).cookie('token',token,options).json({
        success:true,
        taikhoan,
        token,
    }); 
};

module.exports = sendToken;