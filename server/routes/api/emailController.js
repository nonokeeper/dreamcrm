const { db } = require('./mongoDB');
const router = require('./router');
const transporter = require('./nodemailer');
const deepEmailValidator = require('deep-email-validator');
const collectionEmailLog = process.env.LOG_EMAIL;

/*
const MailParser = require('mailparser').MailParser;
const mailparser = new MailParser();

mailparser.on('data', data => {
    console.log('emailController.js > Data mailparser : ', data.toString());
});

mailparser.on('end', () => {
    const bounce = mailparser.getResult().envelope;
    console.log('emailController.js > Bounce mailparser:', bounce);
});

mailparser.on('headers', headers => {
    console.log('emailController.js > Headers mailparser : ', headers);
});
*/

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
    console.log('emailController.js > sendMail > email validity : ', validity);
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
                    sendDate: sendDate,
                    status: "sent"
                  })
                console.log('emailController.js > sendMail > enveloppe : ', info.envelope);
                res.status(200).send("E-mail sent");
                /* Pass the raw email data to the Mailparser object
                try {
                    console.log('emailController.js > sendMail > mailparser before write');
                    mailparser.write(info.envelope.toString());
                    console.log('emailController.js > sendMail > mailparser after write');
                    mailparser.end();
                    console.log('emailController.js > sendMail > mailparser end');
                    console.log('emailController.js > sendMail > mailparser : ', mailparser.toString());
                    res.status(200).send("E-mail sent");
                } catch(err) {
                    console.log('emailController.js > sendMail > mailparser error : ', err);
                    errorMessage = 'E-mail not sent : ' + err;
                    res.status(200).send(errorMessage);
                }
                */
                
            }
        })
    } else {
        errorMessage = 'E-mail not sent because the email adress ('+ message.to + ') is incorrect : ' + emailInvalidReason + ' error';
        console.log('emailController.js > sendMail > errorMessage : ', errorMessage);
        res.status(200).send(errorMessage);
    }
});

module.exports = router