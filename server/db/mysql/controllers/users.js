//import User from '../models/user';
import passport from 'passport'
import moment from 'moment'
import connect from '../connect'
import { unserialize } from 'php-unserialize'
import { insertData, updateData, mysql_real_escape_string } from './helpers'
import { getItemMeta } from './listings'
var hasher = require('wordpress-hash-node')

/**
 * POST /login
 */
export function login(req, res, next) {
  // Do email and password validation for the server
  passport.authenticate('local', (authErr, user, info) => {
    if (authErr) return next(authErr)

    if (!user) {
      return res.status(401).json({ message: info.message })
    }

    return req.logIn(user, (loginErr) => {
      if (loginErr) return res.status(401).json({ message: loginErr })
      return res.status(200).json({
        user: user,
        message: 'You have been successfully logged in.'
      })
    })
  })(req, res, next)
}

export function logOrSignIn(req, res, next) {
  // Do email and password validation for the server
  passport.authenticate('local', (authErr, user, info) => {
    if (authErr) return next(authErr)

    if (!user) {
      if (info.exists) {
        return res.status(401).json({ message: info.message })
      } else {
        return signUp(req, res, next);
      }
    }

    return req.logIn(user, (loginErr) => {
      if (loginErr) return res.status(401).json({ message: loginErr })
      return res.status(200).json({
        user: user,
        message: 'You have been successfully logged in.'
      })
    })
  })(req, res, next)
}

/**
 * POST /logout
 */
export function logout(req, res) {
  // Do email and password validation for the server
  delete req.session.tpId
  delete req.session.tpDay
  req.logout()
  res.redirect('/')

  // req.session.destroy(function (err) {
  //   res.redirect('/');
  // });
}

/**
 * POST /signup
 * Create a new local account
 */
export function signUp(req, res, next) {
  var { email, password, user_firstname, user_phone } = req.body
  var user

  return connect.get().query('SELECT ID as id, user_login as username, user_pass as password, user_email as email FROM wp_users WHERE user_email = "' + email + '"')
    .then(rows => {
      if (!rows.length) {
        const sql = 'INSERT INTO wp_users SET user_login = ?, user_pass = ?, user_nicename = ?, user_email = ?, user_registered = ?, display_name = ?'
        const pass = hasher.HashPassword(password)
        const createDate = moment().format('YYYY-MM-DD HH:mm:ss')

        return connect.get().query(sql, [email, pass, email, email, createDate, email])
          .then(rows => {
            if (rows.insertId) {
              var id = rows.insertId
              var cap = 'a:1:{s:10:"subscriber";b:1;}';
              
              if (user_firstname) {
                insertData({ user_id: id, meta_key: 'first_name', meta_value: user_firstname }, "wp_usermeta")
              }
              if (user_phone) {
                insertData({ user_id: id, meta_key: 'user_phone', meta_value: user_phone }, "wp_usermeta")
              }

              return insertData({ user_id: id, meta_key: 'wp_capabilities', meta_value: mysql_real_escape_string(cap) }, "wp_usermeta").then(rows => {
                return login(req, res, next)
              })

            } else {
              return res.status(401)
            }
          }).catch(error => {
            return res.status(401).json({ message: error })
          })
      } else {
        return res.status(409).json({ message: 'Account with this email address already exists!' })
      }
    }).catch(error => {
      return res.status(401).json({ message: error })
    })
}


export function rating(req, res, next) {
  var { rate, comment, user_id, post_id, insert, user_name } = req.body
  var ip = req.headers['x-real-ip']
  var date = new Date().toJSON().slice(0, 10)

  insertData({ post_id: post_id, user_id: user_id, username: user_name, user_ip: ip, rating: rate, comment: comment, create_date: date }, 'jts_rating').then(rows => {
    getItemMeta(post_id).then(response => {
      connect.get().query('SELECT SUM(rating) AS sumatoria FROM jts_rating WHERE post_id = ?', [post_id]).then(data => {
        var meta = {}

        if (response && response.length) {
          for (var i = 0; i < response.length; i++) {
            var row = response[i]
            if (row.meta_value != 'a:0:{}') {
              meta[row.meta_key] = row.meta_value.indexOf('a:') == 0 ? unserialize(row.meta_value) : row.meta_value
            }
          }
        }

        var sumatoria = (meta.jts_rating && meta.jts_rating > 0) ? data[0].sumatoria : parseFloat(rate)
        var jts_rating_count = meta.jts_rating_count ? parseInt(meta.jts_rating_count) : 0
        var newRate = sumatoria / (jts_rating_count + 1)

        if (insert === 'true') {
          insertData({ post_id: post_id, meta_key: 'jts_rating', meta_value: newRate }, "wp_postmeta")
          insertData({ post_id: post_id, meta_key: '_jts_rating', meta_value: 'field_582b1d6702e58' }, "wp_postmeta")
          insertData({ post_id: post_id, meta_key: 'jts_rating_count', meta_value: jts_rating_count + 1 }, "wp_postmeta")
          insertData({ post_id: post_id, meta_key: '_jts_rating_count', meta_value: 'field_583c5e80bd278' }, "wp_postmeta")
        } else {
          updateData(null, { meta_value: newRate }, 'wp_postmeta', " WHERE tpa.meta_key = 'jts_rating' AND tpa.post_id = " + post_id)
          updateData(null, { meta_value: jts_rating_count + 1 }, 'wp_postmeta', " WHERE tpa.meta_key = 'jts_rating_count' AND tpa.post_id = " + post_id)
        }

        meta.jts_rating = newRate
        meta.jts_rating_count = (jts_rating_count + 1)

        return res.status(200).json(meta)
      }).catch(error => {
        return res.status(401).json(error)
      })

    }).catch(error => {
      return res.status(401).json(error)
    })

  }).catch(error => {
    return res.status(401).json(error)
  })
}

export function getRatings(post_id) {
  if (post_id) {
    return connect.get().query('SELECT * FROM jts_rating WHERE post_id = ?', [post_id])
  } else {
    return null
  }
}

export function updateProfile(req, res, next) {
  var { id, username, first_name, last_name, email, password } = req.body
  console.log(password)
  password = hasher.HashPassword(password)

  Promise.all([
    updateData(null, { meta_value: first_name }, 'wp_usermeta', ' WHERE user_id = ' + id + ' AND meta_key = "first_name"'),
    updateData(null, { meta_value: last_name }, 'wp_usermeta', ' WHERE user_id = ' + id + ' AND meta_key = "last_name"'),
    updateData(id, { user_login: username, user_email: email, user_pass: password }, 'wp_users')])
    .then(response => {
      if (response && response.length > 0 && response[0].affectedRows > 0 && response[1].affectedRows > 0 && response[2].affectedRows > 0) {
        return res.status(200).json({ update: true, password: password })
      } else {
        return res.status(401).json({ error: 'Oops could not update all fields' })
      }
    }).catch(error => {
      return res.status(401).json({ error: error })
    })
}

export default {
  login,
  logOrSignIn,
  logout,
  signUp,
  rating,
  getRatings,
  updateProfile
}
