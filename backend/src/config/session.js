const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);

const isProd = process.env.NODE_ENV === 'production';

const sessionConfig = session({
  store: new pgSession({
    conString: process.env.DATABASE_URL,
    tableName: 'sessions',
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'finmetrics.sid',
  proxy: isProd,
  cookie: {
    httpOnly: true,
    secure: isProd,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
  },
});

module.exports = sessionConfig;
