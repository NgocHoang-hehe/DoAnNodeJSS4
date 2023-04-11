var ErrorHandle = require('../ultis/errorhandle');

module.exports = (err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Lỗi máy chủ";

    if(err.name ==="CastError"){
        var message = `Không tìm thấy trang. Lỗi: ${err.path}`;
        err = new ErrorHandle (message,400);
    }

    // moongoose duplicate 
    if(err.code === 11000){
        var message = `Trùng lặp ${Object.keys(err.keyValue)}`;
         err = new ErrorHandle (message,400);
    }
    //sai jwt 
    if(err.name ==="JsonWebTokenError"){
        var message = `Không tìm thấy json web token, hãy thử lại`;
        err = new ErrorHandle (message,400);
    }

    //sai jwt expire 
    if(err.name ==="TokenExpiredError"){
        var message = `Json web token đã hết hạn, hãy thử lại`;
        err = new ErrorHandle (message,400);
    }

    res.status(err.statusCode).json({
        success:false,
        message: err.message,
    });
};