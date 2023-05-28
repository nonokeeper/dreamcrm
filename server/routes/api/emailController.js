const { db } = require('./mongoDB');
const router = require('./router');
const transporter = require('./nodemailer');
const deepEmailValidator = require('deep-email-validator');
const collectionEmailLog = process.env.LOG_EMAIL;
const baseURL = process.env.BASEURL;

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
    message.to = req.body.to;
    let emailValid = false;
    const validity = await isEmailValid(message.to);
    let jobID = 10;
    message.html += '<img src = "'+baseURL+'/tracking/'+message.to+'/'+jobID+'" style="display:none">';
    console.log('emailController.js > sendMail > email validity : ', validity);
    console.log('emailController.js > message : ', message);
    emailValid = validity.valid;
    const emailInvalidReason = validity.reason;
    if (emailValid) {
        transporter.sendMail(message, (err, info) => {
            if (err) {
                console.log('emailController.js > sendMail > error : ', err);
                res.status(500).send("E-mail not sent => " + err);
            }
            if (info) {
                // TODO Save the send in a log collection
                // Email address + Sent date + Status
                const sendDate = new Date(); // Date.now();
                db.collection(collectionEmailLog).insertOne({
                    email: message.to,
                    jobID: jobID,
                    sendDate: sendDate,
                    status: "sent",
                    openStatus: false
                  })
                console.log('emailController.js > sendMail > enveloppe : ', info.envelope);
                res.status(200).send("E-mail sent");
                                
            }
        })
    } else {
        errorMessage = 'E-mail not sent because the email adress ('+ message.to + ') is incorrect : ' + emailInvalidReason + ' error';
        console.log('emailController.js > sendMail > errorMessage : ', errorMessage);
        res.status(200).send(errorMessage);
    }
});

module.exports = router