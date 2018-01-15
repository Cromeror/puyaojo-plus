// load up the user model
var mysql = require('promise-mysql');
import { database } from '../../../config/localConfig';

var state = {
  pool: null
}

exports.connect = function(done) {
  state.pool = mysql.createPool(database.connection)
  done()
}

exports.get = function() {
  return state.pool
}
