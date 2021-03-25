const express = require('express')
const router = express.Router()
const passport = require('passport')
const CategoryController = require('../controllers/categories.controller')
const category = new CategoryController()
//Categories module
//------------------

//get all categories
router.get(
  '/categories',
  category.getAll
)
//get specified category data
router.get(
  '/categories/:id',
  category.getSpecified
)
//get all posts associated with this category
router.get(
  '/categories/:id/posts',
  category.getPostsWithCategory
)
//create a new category
router.post(
  '/categories',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  category.createNewOne
)
//update specified category
router.patch(
  '/categories/:id',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  category.updateSpecified
)
//delete category
router.delete(
  '/categories/:id',
  /*AUTH--> */ passport.authenticate('jwt', { session: false }),
  category.deleteSpecified
)

module.exports = router
