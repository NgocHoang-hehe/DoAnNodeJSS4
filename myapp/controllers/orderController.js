const { addListener } = require("../app");
var Order = require('../models/orderModel');
var SanPham = require('../models/sanphamModel');
var ErrorHandle = require('../ultis/errorhandle');
var catchAsyncError = require('../middleware/catchAsyncError');
var chucnang = require('../ultis/chucnang');

//tao don hang 
exports.newOrder = catchAsyncError(async(req,res,next)=>{
    var{
        thongtinvanchuyen,
        thongtindonhang,
        thongtinthanhtoan,
        giasanpham,tienship,
        tongtien,
    } = req.body;

    var order = await Order.create({
        thongtinvanchuyen,
        thongtindonhang,
        thongtinthanhtoan,
        giasanpham,tienship,
        tongtien,
        paidAt:Date.now(),
        taikhoan: req.taikhoan._id,
    });

    res.status(201).json({
        success:true,
        order,
    })
});

//get all don hang 
exports.getalldonhang = catchAsyncError(async(req,res,next)=>{
    var order = await Order.find();

    let tongdonhang = 0;

    order.forEach(order =>{
        tongdonhang += order.tongtien;
    });

    res.status(200).json({
        success:true,
        tongdonhang,
        order,
    });

});

//update trang thai don hang 
exports.updatedonhang = catchAsyncError(async(req,res,next)=>{
    var order = await Order.findById(req.params.id);

    if(!order){
        return next (new ErrorHandle("Không tìm thấy đơn đặt hàng này",404));
    }

    if(order.trangthaidonhang === "Đã giao hàng")
    {
        return next(new ErrorHandle("Đơn đặt hàng này đã được giao",400)) ;
    }

    order.thongtindonhang.forEach(async(order)=>{
        await updateSoLuongTon(order.sanpham,order.soluong);
    });

    order.trangthaidonhang = req.body.status;
    if(req.body.status === "Đã giao hàng"){
        order.deliveredAt = Date.now();
    }
    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
    });

});

async function updateSoLuongTon (id,soluong){
    var sanpham = await SanPham.findById(id);

    sanpham.soluongton -= soluong;
    await sanpham.save({validateBeforeSave:false});
}

//delete don hang
exports.deletedonhang = catchAsyncError(async(req,res,next)=>{
    var order = await Order.findByIdAndDelete(req.params.id);

    if(!order){
        return next (new ErrorHandle("Không tìm thấy đơn đặt hàng này",404));
    }

    res.status(200).json({
        success:true,
    });

});

//get 1 don hang 
exports.get1donhang = catchAsyncError(async(req,res,next)=>{
    var order = await Order.findById(req.params.id).populate("taikhoan","tennguoidung email");

    if(!order){
        return next (new ErrorHandle("Không tìm thấy đơn đặt hàng này",404));
    }

    res.status(200).json({
        success:true,
        order,
    });

});

//my order (phải đăng nhập)
exports.myOrder = catchAsyncError(async(req,res,next)=>{
    var order = await Order.find({ taikhoan: req.taikhoan._id})

    res.status(200).json({
        success:true,
        order,
    });

});