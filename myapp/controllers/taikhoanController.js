var ErrorHandle = require('../ultis/errorhandle');
var catchAsyncError = require('../middleware/catchAsyncError');
var TaiKhoan =  require('../models/taikhoanModel');
var sendToken = require('../ultis/jwt');
var sendEmail = require('../ultis/sendemail');
var crypto = require('crypto');

//get all user
exports.getAllUser = catchAsyncError(async (req,res,next) =>{
  var taikhoan = await TaiKhoan.find();

  res.status(200).json({
    success:true,
    taikhoan,
  });
});

//Dang ky

exports.dangky = catchAsyncError (async (req,res,next) =>{
    var { tennguoidung, email, matkhau } = req.body;

    var taikhoan = await TaiKhoan.create({
        tennguoidung,
        email,
        matkhau,
        avatar:{
            public_id:"id",
            url:"url",
        },
    });
    sendToken(taikhoan,201,res);
    
});

//Dang nhap
exports.dangnhap = catchAsyncError (async (req,res,next)=>{
    var { email, matkhau } = req.body;

    // checking if user has given password and email both
  
    if (!email || !matkhau) {
      return next(new ErrorHandle("Vui lòng nhập email hoặc mật khẩu", 400));
    }
  
    var taikhoan = await TaiKhoan.findOne({ email }).select("+password");
  
    if (!taikhoan) {
      return next(new ErrorHandle("Email hoặc mật khẩu không hợp lệ", 401));
    }
  
    var checkPass = await taikhoan.comparePassword(matkhau);
  
    if (!checkPass) {
      return next(new ErrorHandle("Email hoặc mật khẩu không hợp lệ", 401));
    }
    sendToken(taikhoan,200,res);
  });

//Dang xuat
  exports.dangxuat = catchAsyncError(async(req,res,next)=>{
    res.cookie("token",null,{
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    res.status(200).json({
      susscess:true,
      message:"Đã đăng xuất",
    });
  });
//Quen mat khau
  exports.quenmatkhau = catchAsyncError(async(req,res,next)=>{
    var taikhoan = await TaiKhoan.findOne({email:req.body.email});
    if(!taikhoan){
      return next(new ErrorHandle("Tài khoản không tồn tại",404))
    }
    //reset password
    var resetToken = taikhoan.getResetPasswordToken();

    await taikhoan.save({validateBeforeSave:false});

    var resetPasswordUrl = `${req.protocol}://${req.get('host')}/api/v1/matkhau/reset/${resetToken}`;
    var message = `your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it`;

    try{
      await sendEmail({
        email:taikhoan.email,
        subject:`Shop mỹ phẩm password recovery`,
        message,
      });
      res.status(200).json({
        success:true,
        message:`Email send to ${taikhoan.email} successfully`,
      });
    }catch(error){
      taikhoan.resetPasswordToken = undefined;
      taikhoan.resetPasswordExpire = undefined;

      await taikhoan.save({validateBeforeSave: false});
      return next (new ErrorHandle(error.message,500));
    }
  });
//reset mat khau
  exports.resetmatkhau = catchAsyncError(async(req,res,next)=>{

    //creating token hash
    var resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

      var taikhoan = await TaiKhoan.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()},
      });

      if(!taikhoan){
        return next (new ErrorHandle("Reset password token is invalid or has been expired",404));
      }

      if(req.body.matkhau !==  req.body.xacnhanmatkhau){
        return next (new ErrorHandle("Password does not password",404));
      }

      taikhoan.matkhau = req.body.matkhau;
      taikhoan.resetPasswordToken = undefined;
      taikhoan.resetPasswordExpire = undefined;

      await taikhoan.save();

      sendToken(taikhoan,200,res);
  }); 

  //get ho so   
  exports.getHoSo = catchAsyncError(async(req,res,next)=>{
    var taikhoan = await TaiKhoan.findById(req.taikhoan.id);

    res.status(200).json({
      success:true,
      taikhoan,
    });

  });
  //update hoso
  exports.updateHoSo = catchAsyncError(async(req,res,next)=>{
    
    var newHoSo={
      tennguoidung:req.body.tennguoidung,
      email:req.body.email,
    };

    var taikhoan = await TaiKhoan.findByIdAndUpdate(req.taikhoan.id, newHoSo,{
      new: true,
      runValidators: true,
      useFindandModify: false,
    });

    res.status(200).json({
      success:true, 
    });
  });

  //update quyen nguoi dung
  exports.updateQuyen = catchAsyncError(async(req,res,next)=>{
    
    var newHoSo={
      tennguoidung:req.body.tennguoidung,
      email:req.body.email,
      quyen:req.body.quyen,
    };

    var taikhoan = await TaiKhoan.findByIdAndUpdate(req.params.id, newHoSo,{
      new: true,
      runValidators: true,
      useFindandModify: false,
    });

    res.status(200).json({
      success:true, 
    });
  });

  //update matkhau
  exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    var taikhoan = await TaiKhoan.findById(req.taikhoan.id).select("+matkhau");
    var checkPass = await taikhoan.comparePassword(req.body.matkhaucu);
  
    if (!checkPass) {
      return next(new ErrorHandle("Mật khẩu cũ không đúng", 400));
    }

    if(req.body.matkhaumoi !== req.body.xacnhanmatkhau){
      return next(new ErrorHandle("Mật khẩu không hợp lệ", 400));
    }

    taikhoan.matkhau = req.body.matkhaumoi;

    await taikhoan.save();

    sendToken(taikhoan,200,res)

  });

  //get user admin
exports.get1User = catchAsyncError(async (req,res,next) =>{
  var taikhoan = await TaiKhoan.findById(req.params.id);

  if(!taikhoan){
    return next(new ErrorHandle(`Id người dùng không tồn tại: ${req.params.id}`))
  }

  res.status(200).json({
    success:true,
    taikhoan,
  });
});

