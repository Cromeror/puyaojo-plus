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
  // console.log(profile);
  const email = profile.emails[0].value;
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
            connect.get().query('INSERT INTO wp_usermeta (user_id, meta_key, meta_value) VALUES ('+ id +', "facebookid", '+profile.id+')');
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
        return connect.get().query('SELECT * FROM wp_usermeta WHERE meta_key = "facebookid" AND user_id = '+user.id)
          .then(function(rows) {
            if (!rows.length) {
              connect.get().query('INSERT INTO wp_usermeta (user_id, meta_key, meta_value) VALUES ('+  user.id + ', "facebookid", '+profile.id+')');
            }
            done(null, user)
          })
      }
    })
    .catch(function(error) {
      console.log(error);
    })
};
/* eslint-enable no-param-reassign */
