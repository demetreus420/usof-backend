const express = require('express')
const router = express.Router()
const parser = require('body-parser').urlencoded({ extended: false })
const AuthController = require('../controllers/auth.contoller')
const auth = new AuthController()
//Auth module
//-----------
//чисто тестовый роут, по нему будет отправлена форма для смены пароля
router.get('/auth/password-reset-test/:token', auth.testResetPassForm)
//роут для подтверждения почты
router.get('/auth/email-confirmation/:token', auth.emailConfirm)
//reg of new user
router.post('/auth/register', auth.reg)
//log in user
router.post('/auth/login', auth.login)
//log out user
router.post('/auth/logout', auth.logout)
//send a reset link to user email
router.post('/auth/password-reset', auth.resetPassword)
//confirm new password with a token from email
router.post('/auth/password-reset/:token', parser, auth.confirmNewPasswprd)

module.exports = router
