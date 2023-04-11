var express = require('express');
var {
    getTatCaSanPham, 
    themSanPham, 
    updateSanPham, 
    getChiTietSanPham,
    createProductReview,
    getAllDanhGia,
    deleteDanhGia,
} = require("../controllers/sanphamController");
var {xacthuctaikhoan, quyentruycap} = require('../middleware/authentication');
var router = express.Router();

router.route("/sanpham").get(getTatCaSanPham);

router.route("/admin/sanpham/new").post(xacthuctaikhoan, quyentruycap('admin'),themSanPham);

router.route("/admin/sanpham/:id").put(xacthuctaikhoan, quyentruycap('admin'),updateSanPham);

router.route("/sanpham/:id").get(getChiTietSanPham);

router.route("/danhgia").put(xacthuctaikhoan,createProductReview);

router.route("/danhgias").get(getAllDanhGia).delete(xacthuctaikhoan,deleteDanhGia);

module.exports = router;


