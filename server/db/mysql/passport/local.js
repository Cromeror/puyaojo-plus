var hasher = require('wordpress-hash-node');

import connect from '../connect'

export default (email, password, done) => {
  const sql = 'SELECT wu.ID as id, user_login as username, user_pass as password, user_email as email, fname.meta_value as first_name, lname.meta_value as last_name, phone.meta_value as phone'+
              ' FROM wp_users wu'+
              ' LEFT JOIN wp_usermeta fname ON fname.user_id = wu.ID AND fname.meta_key = "first_name"'+
              ' LEFT JOIN wp_usermeta lname ON lname.user_id = wu.ID AND lname.meta_key = "last_name"'+
              ' LEFT JOIN wp_usermeta phone ON phone.user_id = wu.ID AND phone.meta_key = "user_phone"'+
              ' WHERE user_email = ?';

  connect.get().query(sql,[email])
    .then(function(rows){
      if (!rows.length) {
        return done(null, false, { exists: false, message: `There is no record of the email ${email}.` });
      }
      var checked = hasher.CheckPassword(password, rows[0].password);
      // if the user is found but the password is wrong
      if (!checked) {
        return done(null, false, { exists: true, message: 'Your email or password combination is not correct.' });
      }
      // all is well, return successful user
      return done(null, rows[0]);
    }).catch(function(err) {
      return done(err);
    });
};