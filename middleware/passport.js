const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const keys = require('../config/keys')
const db = require('../model/db')

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: keys.jwt,
}

const middleware = (passport) => {
  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      const getIdQuery = {
        text: 'SELECT * FROM users WHERE id=$1;',
        values: [payload.userId],
      }
      await db.query(getIdQuery, (err, res) => {
        if (err) {
          done(null, false)
          console.log(err)
        } else {
          done(null, payload)
        }
      })
      //
    })
  )
}

module.exports = middleware
