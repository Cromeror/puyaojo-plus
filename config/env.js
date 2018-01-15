import { DB_TYPES } from './dbTypes'
import { serverConfig } from './localConfig'

export const HOST = process.env.HOSTNAME || serverConfig.apiUrl
export const ENV = process.env.NODE_ENV || 'development'
export const DB_TYPE = process.env.DB_TYPE || DB_TYPES.MYSQL
export const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID || 'UA-826659-10'