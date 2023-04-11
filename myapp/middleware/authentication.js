var config = require('../configs/config');
var ErrorHandle = require('../ultis/errorhandle');
var catchAsyncError = require('./catchAsyncError');
var jwt = require('jsonwebtoken');
var TaiKhoan =  require('../models/taikhoanModel');


exports.xacthuctaikhoan = catchAsyncError(async(req,res,next)=>{
    var {token} = req.cookies;
    console.log(token);

    if(!token){
        return next(new ErrorHandle('Vui lòng đăng nhập để có thể truy cập',401));
    }
    var decodedData = jwt.verify(token,config.JWT_SECRET);

    req.taikhoan =  await TaiKhoan.findById(decodedData.id);

    next();
});

exports.quyentruycap = (...quyens) =>{
    return (req,res,next)=>{
      if(!quyens.includes(req.taikhoan.quyen)){
           return next( 
            new ErrorHandle(`quyen: ${req.taikhoan.quyen} không được phép truy cập`,403
            )
        );
      }
      next();
    };
}