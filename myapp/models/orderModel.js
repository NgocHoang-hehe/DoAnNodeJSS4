const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  thongtinvanchuyen: {
    diachi: {
      type: String,
      required: true,
    },
    sodienthoai: {
      type: Number,
      required: true,
    },
  },
  thongtindonhang: [
    {
      tensanpham: {
        type: String,
        required: true,
      },
      gia: {
        type: Number,
        required: true,
      },
      soluong: {
        type: Number,
        required: true,
      },
      hinhanh: {
        type: String,
        required: true,
      },
      sanpham: {
        type: mongoose.Schema.ObjectId,
        ref: "SanPham",
        required: true,
      },
    },
  ],
  taikhoan: {
    type: mongoose.Schema.ObjectId,
    ref: "TaiKhoan",
    required: true,
  },
  thongtinthanhtoan: {
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  giasanpham: {
    type: Number,
    required: true,
    default: 0,
  },
  tienship: {
    type: Number,
    required: true,
    default: 0,
  },
  tongtien: {
    type: Number,
    required: true,
    default: 0,
  },
  trangthaidonhang: {
    type: String,
    required: true,
    default: "Đang xử lý",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);