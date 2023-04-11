var mongoose = require('mongoose');

var loaispSchema = new mongoose.Schema({
    loaisanpham:{
        type: String,
        required:[true, "Vui lòng điền tên loại sản phẩm"],
    },
    createAt:{
        type:Date,
        default:Date.now
    },
});

module.exports = mongoose.model ("LoaiSP",loaispSchema);