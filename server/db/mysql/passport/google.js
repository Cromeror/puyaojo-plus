import connect from '../connect'
import moment from 'moment'
var hasher = require('wordpress-hash-node');

function mysql_real_escape_string(str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

/* eslint-disable no-param-reassign */
export default (req, accessToken, refreshToken, profile, done) => {
  const email = profile._json.emails[0].value;
  var user;
  return connect.get().query('SELECT ID as id, user_login as username, user_pass as password, user_email as email FROM wp_users WHERE user_email = "' + email + '"')
    .then(function(rows) {
      if (!rows.length) {
        const name = profile.name.givenName + '_' + profile.name.familyName; 
        const password = hasher.HashPassword('/sunn1l1f3*')
        const createDate = moment().format('YYYY-MM-DD HH:mm:ss');

        const values = '("' + email + '","' + password + '","' + name + '","' + email + '","' + createDate + '","' + name + '")';
        const sql = 'INSERT INTO wp_users (user_login, user_pass, user_nicename, user_email, user_registered, display_name) VALUES ' + values;
        return connect.get().query(sql)
          .then(function(rows) {
            const id = rows.insertId;
            var cap = 'a:1:{s:10:"subscriber";b:1;}';
            connect.get().query('INSERT INTO wp_usermeta (user_id, meta_key, meta_value) VALUES ('+ id +', "googleid", '+profile.id+')');
            connect.get().query('INSERT INTO wp_usermeta (user_id, meta_key, meta_value) VALUES ('+ id +', "first_name", "'+profile.name.givenName+'")');
            connect.get().query('INSERT INTO wp_usermeta (user_id, meta_key, meta_value) VALUES ('+ id +', "last_name", "'+profile.name.familyName+'")');
            connect.get().query('INSERT INTO wp_usermeta (user_id, meta_key, meta_value) VALUES ('+ id +', "wp_capabilities", "' + mysql_real_escape_string(cap) + '")');
            
            user = {
              id: id,
              username: email,
              password: password,
              email: email,
              first_name: profile.name.givenName,
              last_name: profile.name.familyName
            }
            
            done(null, user)

          })
      } else {
        user = rows[0];
        // console.log('mysql');
        // console.log(user);
        return connect.get().query('SELECT * FROM wp_usermeta WHERE meta_key = "googleid" AND user_id = '+user.id)
          .then(function(rows) {
            if (!rows.length) {
              connect.get().query('INSERT INTO wp_usermeta (user_id, meta_key, meta_value) VALUES ('+  user.id + ', "googleid", '+profile.id+')');
            }
            done(null, user)
          })
      }
    })
    .catch(function(error) {
      console.log(error);
    })
  // if (req.user) {
  //   console.log(req.user)
    // return User.findOne({ google: profile.id }, (findOneErr, existingUser) => {
    //   if (existingUser) {
    //     return done(null, false, { message: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
    //   }
    //   return User.findById(req.user.id, (findByIdErr, user) => {
    //     user.google = profile.id;
    //     user.tokens.push({ kind: 'google', accessToken });
    //     user.profile.name = user.profile.name || profile.displayName;
    //     user.profile.gender = user.profile.gender || profile._json.gender;
    //     user.profile.picture = user.profile.picture || profile._json.picture;
    //     user.save((err) => {
    //       done(err, user, { message: 'Google account has been linked.' });
    //     });
    //   });
    // });
  // }
  // return User.findOne({ google: profile.id }, (findByGoogleIdErr, existingUser) => {
  //   if (existingUser) return done(null, existingUser);
  //   return User.findOne({ email: profile._json.emails[0].value }, (findByEmailErr, existingEmailUser) => {
  //     if (existingEmailUser) {
  //       return done(null, false, { message: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
  //     }
  //     const user = new User();
  //     user.email = profile._json.emails[0].value;
  //     user.google = profile.id;
  //     user.tokens.push({ kind: 'google', accessToken });
  //     user.profile.name = profile.displayName;
  //     user.profile.gender = profile._json.gender;
  //     user.profile.picture = profile._json.picture;
  //     return user.save((err) => {
  //       done(err, user);
  //     });
  //   });
  // });
};
/* eslint-enable no-param-reassign */
