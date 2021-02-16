const express = require('express')
const router = express.Router()
const passport = require('passport')
const CommentController = require('../controllers/comments.controller')
const comment = new CommentController()
//Comments module
//---------------

//get specified comment data
router.get(
  '/comments/:id',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  comment.getSpecified
)
//get all likes under the specified comment
router.get(
  '/comments/:id/like',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  comment.getSpecifiedLikes
)
//create a new like under the comment
router.post(
  '/comments/:id/like',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  comment.postLike
)
//update specified comment data
router.patch(
  '/comments/:id',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  comment.updateSpecified
)
//delete a comment
router.delete(
  '/comments/:id',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  comment.deleteSpecified
)
//delete a like under a comment
router.delete(
  '/comments/:id/like',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  comment.deleteSpecifiedLike
)

module.exports = router
