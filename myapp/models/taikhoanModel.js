var mongoose = require('mongoose');
var validator = require('validator');
var bcrypt = require('bcrypt');
var config = require('../configs/config');
var jwt = require('jsonwebtoken');
var crypto = require('crypto');


var taikhoanSchema = new mongoose.Schema({
    tennguoidung:{
        type: String,
        required:[true, "Vui lòng điền tên người dùng"],
        maxLength:[30,"Tên người dùng không quá 30 ký tự"],
        minLength:[4,"Tên người dùng phải trên 4 ký tự"],
    },
    email:{
        type: String,
        required:[true,"Vui lòng điền email của bạn"],
        unique: true,
        validate:[validator.isEmail,"vui lòng nhập email hợp lẹ"],
    },
    matkhau:{
        type: String,
        required:[true,"Vui lòng điền mật khẩu của bạn"],
        minLength:[8,"Mật khẩu phải trên 8 ký tự"],
    },
    avatar:{
        public_id:{
            type: String,
            required:true
        },
        url:{
            type: String,
            required:true
        }
    },
    quyen:{
        type: String,
        default: "user",
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
});

taikhoanSchema.pre("save", async function(next){

    if(this.isModified("password")){
        next();
    }
    this.matkhau = await bcrypt.hash(this.matkhau,10);

})
//JSON Web Token
taikhoanSchema.methods.getJWT = function (){
    return jwt.sign({ id: this._id },config.JWT_SECRET,{
        expiresIn:config.JWT_EXPIRE,
    });
};
// Compare Password

taikhoanSchema.methods.comparePassword = async function (matkhau) {
    return await bcrypt.compare(matkhau, this.matkhau);
  };
  
  //Generating Password Reset Token
  taikhoanSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString("hex");
  
    //Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
  
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  
    return resetToken;
  };
module.exports = mongoose.model ("TaiKhoan",taikhoanSchema);