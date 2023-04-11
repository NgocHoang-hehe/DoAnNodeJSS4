const { addListener } = require("../app");
var LoaiSanPham = require('../models/loaiSPModel');
var ErrorHandle = require('../ultis/errorhandle');
var catchAsyncError = require('../middleware/catchAsyncError');
var chucnang = require('../ultis/chucnang');
const loaiSPModel = require("../models/loaiSPModel");

//Them loai san pham -- admin
exports.themLoaiSP = catchAsyncError (async (req,res,next)=>{
    req.body.taikhoan = req.taikhoan.id;
    var loai = await LoaiSanPham.create(req.body);

    res.status(201).json({
        success:true,
        loai,
    });
});

//get tat ca san pham
exports.getTatCaloaiSP = catchAsyncError (async (req,res) =>{
    var resultPerPage = 5;
    var sanphamCount = await LoaiSanPham.countDocuments();
    var apichucnang = new chucnang(LoaiSanPham.find(),req.query).search().filter().pagination(resultPerPage);
    var sanpham = await apichucnang.query;

    res.status(200).json({
        sanpham,
    });
});
//cap nhat san pham -- admin
exports.updateLoaiSanPham= catchAsyncError (async (req,res,next) =>{
    let loaisanpham = await LoaiSanPham.findById(req.params.id);
    if(!loaisanpham){
        return next(new ErrorHandle("Không tìm thấy sản phẩm", 404));    
    }
    loaisanpham = await LoaiSanPham.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        loaisanpham,
    });
});  
