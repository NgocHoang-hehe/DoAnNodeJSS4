var nodeMailer = require('nodemailer');
var config = require('../configs/config');

var sendEmail = async (options) =>{
    var transporter = nodeMailer.createTransport({ 
        host:config.mail_host,
        port:config.mail_port, 
        service:config.mail_service,
        auth:{
            user: config.mail_user,
            pass: config.mail_password,
        },
    });
    var mailOptions = {
        from: config.mail_user,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;