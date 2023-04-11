var mongoose = require('mongoose');

var sanphamSchema = mongoose.Schema({
    tensanpham:{
        type:String,
        required:[true,"Vui lòng nhập tên sản phẩm"],
        trim:true
    },
    mota:{
        type:String,
        required:[true,"Vui lòng nhập mô tả sản phẩm,"]
    },
    gia:{
        type:Number,
        required:[true,"Vui lòng nhập giá sản phẩm,"],
        maxLength:[10,"Nhập vừa thôi"]
    },
    ratings:{
        type:Number,
        default:0
    },
    hinhanh:{
        type:String,
        required:[true,"Vui lòng nhập hình ảnh"]
    }
    ,
    loaisanpham:{
        type:String,
        required:[true,"Vui lòng nhập loại sản phẩm"],
    },
    soluongton:{
        type:Number,
        required:[true,"Vui lòng nhập số lượng tồn"],
        maxLength:[4,"Nhập không vượt quá 4 ký tự"],
        default:1,
    },
    status:{
        type:String,
        required:true
    },
    sodanhgia:{
        type:Number,
        default:0
    },
    danhgia:[
        {
            taikhoan:{
                type:mongoose.Schema.ObjectId,
                ref:"TaiKhoan",
                required: true,
            },
            tennguoidung:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true,
            },
            binhluan:{
                type:String,
                required:true
            }
        }
    ],
    taikhoan:{
        type:mongoose.Schema.ObjectId,
        ref:"TaiKhoan",
        required: true,
    },
    createAt:{
        type:Date,
        default:Date.now
    }

})

module.exports = mongoose.model("SanPham",sanphamSchema);