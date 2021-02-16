const express = require('express')
const passport = require('passport')
const router = express.Router()
const UserController = require('../controllers/users.controller')
const user = new UserController()
const multer = require('multer')
const upload = multer({
  dest: 'images',
  fileFilter: function (req, file, cb) {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpeg' ||
      file.mimetype == 'image/jpg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
})

//User module
//-----------
//get all users
router.get(
  '/users',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  user.getAll
)
//get specified user data
router.get(
  '/users/:id',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  user.getSpecified
)
//create new user [login, pass, conf-pass, email, role] obly for admins
router.post(
  '/users',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  user.createNewOne
)
// is for authorized user to upload its avatar
router.post('/users/avatar', upload.any(), user.uploadAvatar)
//update user data
router.patch(
  '/users/:id',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  user.updateSpecified
)
//delete user
router.delete(
  '/users/:id',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  user.deleteSpecified
)

module.exports = router
