const { addListener } = require("../app");
var SanPham = require('../models/sanphamModel');
var ErrorHandle = require('../ultis/errorhandle');
var catchAsyncError = require('../middleware/catchAsyncError');
var chucnang = require('../ultis/chucnang');

//Them san pham -- admin
exports.themSanPham = catchAsyncError (async (req,res,next)=>{
    req.body.taikhoan = req.taikhoan.id;
    var sanpham = await SanPham.create(req.body);

    res.status(201).json({
        success:true,
        sanpham,
    });
});

//get tat ca san pham
exports.getTatCaSanPham = catchAsyncError (async (req,res) =>{
    var resultPerPage = 5;
    var sanphamCount = await SanPham.countDocuments();
    var apichucnang = new chucnang(SanPham.find(),req.query).search().filter().pagination(resultPerPage);
    var sanpham = await apichucnang.query;

    res.status(200).json({
        success:true,
        sanpham,
        sanphamCount,
    });
});
//get chi tiet san pham
exports.getChiTietSanPham = catchAsyncError (async (req,res,next) =>{
    var sanpham = await SanPham.findById(req.params.id);

    if(!sanpham){
        return next(new ErrorHandle("Không tìm thấy sản phẩm", 404));    
    }
    res.status(200).json({
        success: true,
        sanpham,
    });
});


//cap nhat san pham -- admin
exports.updateSanPham = catchAsyncError (async (req,res,next) =>{
    let sanpham = await SanPham.findById(req.params.id);
    if(!sanpham){
        return next(new ErrorHandle("Không tìm thấy sản phẩm", 404));    
    }
    sanpham = await SanPham.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    });

    res.status(200).json({
        success:true,
        sanpham,
    });
});  

//tạo review sản phẩm
exports.createProductReview = catchAsyncError(async (req,res,next) =>{
    var{rating, binhluan, idSanPham} = req.body;
    var danhgias = {
        taikhoan: req.taikhoan._id,  
        tennguoidung: req.taikhoan.tennguoidung,
        rating: Number(rating),
        binhluan,

    };
    var sanpham = await SanPham.findById(idSanPham);;

    var checkdanhgia = sanpham.danhgia.find((dg) => dg.taikhoan.toString() === req.taikhoan._id.toString());

    if(checkdanhgia){
        sanpham.danhgia.forEach(dg => {
            if(dg.taikhoan.toString() === req.taikhoan._id.toString())
            (dg.rating = rating),(dg.binhluan = binhluan);
        });
    }
    else{
        sanpham.danhgia.push(danhgias)
        sanpham.sodanhgia = sanpham.danhgia.length
    }

    let avg = 0;
    sanpham.danhgia.forEach((dg) =>{
        avg += dg.rating;
    })
    sanpham.ratings = avg / sanpham.danhgia.length;      
    
    await sanpham.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
    });
});

//get all danh gia
exports.getAllDanhGia = catchAsyncError(async(req,res,next) =>{
    var sanpham = await SanPham.findById(req.query.id);

    if(!sanpham){
        return next(new ErrorHandle("Không tìm thấy sản phẩm",404));
    }
    res.status(200).json({
        success:true,
        danhgia: sanpham.danhgia,
    });
});

//delete danhgia
exports.deleteDanhGia = catchAsyncError(async(req,res,next) =>{
    var sanpham = await SanPham.findById(req.query.idSanPham);

    if(!sanpham){
        return next(new ErrorHandle("Không tìm thấy sản phẩm",404));
    }
    var danhgia = sanpham.danhgia.filter((dg) => dg._id.toString() !== req.query.id.toString());

    let avg = 0;
    danhgia.forEach((dg) =>{
        avg += dg.rating;
    });
    var ratings = avg/danhgia.length; 
    var sodanhgia = danhgia.length;

    await SanPham.findByIdAndUpdate(req.query.idSanPham,{
        danhgia,
        ratings,
        sodanhgia,
    },
    {
        new:true,
        runValidators:true,
        useFindAndModify:false,
    }
    );

    res.status(200).json({
        success:true,
    });
});