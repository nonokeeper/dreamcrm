const { db, mongodb } = require('./mongoDB');
const router = require('./router');
const transporter = require('./nodemailer');
const deepEmailValidator = require('deep-email-validator');
const collectionEmailLog = process.env.LOG_EMAIL;

const isEmailValid = async (email) => {
    const items = email.split(/[;,]/);
    let result = (items.length === 1)? deepEmailValidator.validate({
        email: email,
        sender: process.env.NM_USER,
        validateRegex: true,
        validateMx: true,
        validateTypo: true,
        validateDisposable: true,
        validateSMTP: false,
        }) : false;
    return result;
}

var message = {
  from: process.env.NM_USER,
  subject: "Test Nodemailer",
  text: "NADA",
  html: "<b>HTML NADA</b>"
};

// Send Email to recipients
router.post('/email', async(req,res) => {
    //console.log('emailController.js > sendMail > TO : ', req.body.to);
    message.to = req.body.to;
    //console.log('emailController.js > sendMail > message : ', message);
    let emailValid = false;
    const validity = await isEmailValid(message.to);
    console.log('emailController.js > sendMail > email validity : ', validity);
    emailValid = validity.valid;
    const emailInvalidReason = validity.reason;
    if (emailValid) {
        transporter.sendMail(message, (err, info) => {
            if (info) {
                // TODO Save the send in a log collection
                // Email address + Sent date + Status
                const sendDate = Date.now();
                db.collection(collectionEmailLog).insertOne({
                    email: message.to,
                    sendDate: sendDate,
                    status: "sent"
                  })
                
                console.log('emailController.js > sendMail > enveloppe : ', info.envelope);
                res.status(200).send("E-mail sent");
            }
            if (err) {
                console.log('emailController.js > sendMail > error : ', err);
                res.status(500).send("E-mail not sent => " + err);
            }
        })
    } else {
        errorMessage = 'E-mail not sent because the email adress ('+ message.to + ') is incorrect : ' + emailInvalidReason + ' error';
        console.log('emailController.js > sendMail > errorMessage : ', errorMessage);
        res.status(200).send(errorMessage);
    }
    
})

module.exports = router