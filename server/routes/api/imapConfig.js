var Imap = require('imap')

var imap = new Imap({
    imap: {
        user: process.env.NM_USER,
        password: process.env.NM_PASS,
        host: 'imap.yahoo.com',
        port: 993,
        authTimeout: 10000,
        tls: true,
        tlsOptions: { rejectUnauthorized: false },
    },
});

module.exports = imap