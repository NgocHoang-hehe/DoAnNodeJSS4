var express = require('express');
var {
    getTatCaloaiSP, 
    themLoaiSP, 
    updateLoaiSanPham, 
} = require("../controllers/loaisanphamController");
var {xacthuctaikhoan, quyentruycap} = require('../middleware/authentication');
var router = express.Router();

router.route("/loaisanpham").get(getTatCaloaiSP);

router.route("/admin/loaisanpham/new").post(xacthuctaikhoan, quyentruycap('admin'),themLoaiSP);

router.route("/admin/loaisanpham/:id").put(xacthuctaikhoan, quyentruycap('admin'),updateLoaiSanPham);

module.exports = router;