const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: "yahoo",
    auth: {
      user: process.env.NM_USER,
      pass: process.env.NM_PASS
    },
});

module.exports = transporter