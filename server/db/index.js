import { DB_TYPE } from '../../config/env'
import { DB_TYPES } from '../../config/dbTypes'

let dbConfig = require('./mysql')

export const connect = dbConfig.connect
export const controllers = dbConfig.controllers
export const passport = dbConfig.passport
export const session = dbConfig.session

export default dbConfig.default