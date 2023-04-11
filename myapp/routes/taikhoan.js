var express = require('express');
var {
        dangky,
        dangnhap,
        dangxuat,
        quenmatkhau,
        resetmatkhau,
        getHoSo,
        updatePassword,
        updateHoSo,
        getAllUser,
        get1User,
        updateQuyen,
    } = require('../controllers/taikhoanController');
var router = express.Router();
var {xacthuctaikhoan, quyentruycap} = require('../middleware/authentication');

router.route('/dangky').post(dangky);

router.route('/dangnhap').post(dangnhap); 

router.route('/matkhau/quenmatkhau').post(quenmatkhau);

router.route('/matkhau/reset/:token').put(resetmatkhau);

router.route('/dangxuat').get(dangxuat);

router.route('/hoso').get(xacthuctaikhoan,getHoSo);

router.route('/matkhau/doimatkhau').put(xacthuctaikhoan,updatePassword);

router.route('/hoso/capnhathoso').put(xacthuctaikhoan,updateHoSo);

router.route('/admin/taikhoan').get(xacthuctaikhoan,quyentruycap('admin'),getAllUser);

router.route('/admin/taikhoan/:id').get(xacthuctaikhoan,quyentruycap('admin'),get1User).put(xacthuctaikhoan,quyentruycap('admin'),updateQuyen);

module.exports = router;