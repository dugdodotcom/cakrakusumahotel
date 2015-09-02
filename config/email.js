'use strict';

/**
 * Module dependencies.
 */


module.exports = function(nodemailer) {
    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "Gmail",
        auth: {
            user: "sulastriaisyah@gmail.com",
            pass: "b312n4nd4"
        }
    });
}
