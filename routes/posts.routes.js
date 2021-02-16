const express = require('express')
const passport = require('passport')
const router = express.Router()
const PostController = require('../controllers/posts.controller')
const post = new PostController()
//Post module
//------------
//get all posts
router.get(
  '/posts',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  post.getAll
)
//get specified post data
router.get(
  '/posts/:id',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  post.getSpecified
)
//get all comments for specified post
router.get(
  '/posts/:id/comments',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  post.getAllComments
)
//get all categories associated with current post
router.get(
  '/posts/:id/categories',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  post.getAllCategories
)
//get all likes under specified post
router.get(
  '/posts/:id/like',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  post.getAllLikes
)
//create a new comment
router.post(
  '/posts/:id/comments',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  post.createNewComment
)
//create new post
router.post(
  '/posts',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  post.createNewOne
)
//create a new like under the post
router.post(
  '/posts/:id/like',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  post.createNewLike
)
//update the specified post
router.patch(
  '/posts/:id',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  post.updateSpecified
)
//delete a post
router.delete(
  '/posts/:id',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  post.deleteSpecified
)
//delete like under specified post
router.delete(
  '/posts/:id/like',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  post.deleteSpecifiedLike
)

module.exports = router
