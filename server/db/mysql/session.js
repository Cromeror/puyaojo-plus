import session from 'express-session';
import connect from './connect'
var MySQLStore = require('express-mysql-session')(session);

export default () =>
  new MySQLStore({}, connect.get());
