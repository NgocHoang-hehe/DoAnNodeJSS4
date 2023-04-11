var express = require('express');
var router = express.Router();

var {
     newOrder, 
     get1donhang,
     myOrder,
     getalldonhang,
     updatedonhang,
     deletedonhang
     } = require('../controllers/orderController');

var {xacthuctaikhoan, quyentruycap} = require('../middleware/authentication');

router.route("/order/new").post(xacthuctaikhoan,newOrder);

router.route("/order/:id").get(xacthuctaikhoan,get1donhang);

router.route("/orders/myorder").get(xacthuctaikhoan,myOrder);

router.route("/admin/orders/").get(xacthuctaikhoan,quyentruycap("admin"),getalldonhang);

router.route("/admin/order/:id").put(xacthuctaikhoan,quyentruycap("admin"),updatedonhang).delete(xacthuctaikhoan,quyentruycap("admin"),deletedonhang);


module.exports = router;