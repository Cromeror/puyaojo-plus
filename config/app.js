import { HOST, PORT, ENV } from './env'

export const isProduction = ENV === 'production'
export const isDebug = ENV === 'development'
export const isClient = typeof window !== 'undefined'

//export const baseURL = `http://${HOST}:${PORT}`;
export const baseURL = HOST

// Replace with 'UA-########-#' or similar to enable tracking
export const trackingID = "'UA-24614421-2'"