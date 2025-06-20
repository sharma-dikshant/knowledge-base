const session = require("express-session");

const sessionMiddleware = session({
    secret: "captcha-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 1000 } // 5 minutes
});

module.exports = sessionMiddleware;
