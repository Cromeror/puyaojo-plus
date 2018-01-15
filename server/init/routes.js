/**
 * Routes for express app
 */
import passport from 'passport'
import unsupportedMessage from '../db/unsupportedMessage'
import { controllers, passport as passportConfig } from '../db'

const usersController = controllers && controllers.users
const mailController = controllers && controllers.mail

/**
 * Feathers services 
 */

export default (app) => {
  // user routes
  if (usersController) {
    app.post('/login', usersController.login)
    app.post('/logsignin', usersController.logOrSignIn)
    app.post('/signup', usersController.signUp)
    app.post('/logout', usersController.logout)
    app.post('/contact', mailController.sendMail)
    app.post('/update-profile', usersController.updateProfile)
    app.post('/mail', mailController.sendMail)
  } else {
    console.warn(unsupportedMessage('users routes'))
  }

  app.get('/session/hidePopupRegister', function (req, res) {
    req.session.hidePopupRegister = 1
    req.session.save()
    res.end()
  })

  app.get('/session/getPopupRegister', function (req, res) {
    res.json({ hidePopupRegister: req.session.hidePopupRegister ? req.session.hidePopupRegister : 0 })
  })

  if (passportConfig && passportConfig.google) {

    // google auth
    // Redirect the user to Google for authentication. When complete, Google
    // will redirect the user back to the application at
    // /auth/google/return
    // Authentication with google requires an additional scope param, for more info go
    // here https://developers.google.com/identity/protocols/OpenIDConnect#scope-param
    app.get('/user/auth/google', function (req, res, next) {
      req.session.returnTo = req.headers.referer
      next()
    },
      passport.authenticate('google', {
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ],
        display: 'popup'
      })
    )

    app.get('/user/auth/facebook', function (req, res, next) {
      req.session.returnTo = req.headers.referer
      next()
    },
      passport.authenticate('facebook', {
        scope: [
          'email'
        ],
        display: 'popup'
      })
    )

    // Google will redirect the user to this URL after authentication. Finish the
    // process by verifying the assertion. If valid, the user will be logged in.
    // Otherwise, the authentication has failed.
    app.get('/auth/google/callback',
      passport.authenticate('google', {}), function (req, res) {
        res.redirect(req.session.returnTo)
        delete req.session.returnTo
      })

    app.get('/auth/fb/callback',
      passport.authenticate('facebook', {}), function (req, res) {
        res.redirect(req.session.returnTo)
        delete req.session.returnTo
      })
  }
}