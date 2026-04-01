const session = require('express-session');

const isProd = process.env.NODE_ENV === 'production';

const sessionConfig = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'finmetrics.sid',
  proxy: isProd, // trust reverse proxy (Render/Vercel)
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
});

module.exports = sessionConfig;
