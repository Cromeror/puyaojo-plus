var connect = require('../connect');

export default (id, done) => {
  const sql = 'SELECT ID as id, user_login as username, user_pass as password, user_email as email, fname.meta_value as first_name, lname.meta_value as last_name, phone.meta_value as user_phone, capabilities.meta_value AS capabilities'+
              ' FROM wp_users wu'+
              ' LEFT JOIN wp_usermeta fname ON fname.user_id = wu.ID AND fname.meta_key = "first_name"'+
              ' LEFT JOIN wp_usermeta lname ON lname.user_id = wu.ID AND lname.meta_key = "last_name"'+
              ' LEFT JOIN wp_usermeta phone ON phone.user_id = wu.ID AND phone.meta_key = "user_phone"'+
              'LEFT JOIN wp_usermeta capabilities ON capabilities.user_id = wu.ID AND capabilities.meta_key = "wp_user_level"' +
              ' WHERE ID = ?';

  connect.get().query(sql,[id], function(err, rows){
    done(err, rows[0]);
  });
}