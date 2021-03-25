const db = require('../model/db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const keys = require('../config/keys')
const mailer = require('../model/nodemailer')

class AuthController {
  //
  //
  async reg(req, res) {
    let {
      login,
      password,
      passwordConfirm,
      fullname,
      email,
      role
    } = req.body
    const loginEmailCheck = await db.query(
      'SELECT * FROM users WHERE login=$1 OR email=$2;',
      [login, email]
    )
    // console.log(
    //   `

    //   *-----------------------
    //     >${login}
    //     >${password}
    //     >${passwordConfirm}
    //     >${fullname}
    //     >${email}
    //     >${role}

    //     >LOGIN & EMAIL CHECK: ===> ${!!loginEmailCheck} 
    //   *-----------------------
      
    //   `
    // );
    if (passwordConfirm != password) {
      res.status(400)
      res.send({ text: 'not indentical passwords' })
    } else if (!!loginEmailCheck.rows[0]) {
      res.status(409)
      res.send({ text: 'login or email is not unique' })
    } else {
      //make a salt(hash) for password defence
      const salt = bcrypt.genSaltSync(10)
      password = bcrypt.hashSync(password, salt)
      
      const newUser = await db.query(
        `INSERT INTO users (login, password, email, role, fullname)
         VALUES($1, $2, $3, $4, $5) RETURNING id;`,
        [login, password, email, role, fullname]
      )
      // console.log('JWT KEY-->' , keys.jwt)
      const token = jwt.sign(
        {
          role,
          email,
          userId: newUser.rows[0].id,
          expiresIn: Date.now() + 3600000,
        },
        keys.jwt,
        { expiresIn: '1h' }
      )
      const message = {
        to: email,
        subject: '[USOF:dgorkavyi]Email Confirm',
        html: `<h1>Лови ссылку на подтверждение почты</h1>
              <h2>Тебе нужно пройти по ней</h2>
              <h2>
                <a href="http://localhost:8080/api/auth/email-confirmation/${token}">
                  http://localhost:8080/api/auth/email-confirmation/${token}
                </a>
              </h2>     
        `, // html body
      }
      mailer(message)
      res.status(200)
    }
    res.end()
  }
  //
  //
  async login(req, res) {
    let { login, password, email } = req.body
    const userData = await db.query(
      'SELECT * FROM users WHERE login=$1 OR email=$2;',
      [login, email]
    )
    if (userData.rows[0]) {
      if (userData.rows[0].email_confirm) {
        const passResult = bcrypt.compareSync(
          password,
          userData.rows[0].password
        )
        if (passResult) {
          //token generation
          const token = jwt.sign(
            {
              role: userData.rows[0].role,
              email: userData.rows[0].email,
              userId: userData.rows[0].id,
              expiresIn: Date.now() + 3600000,
            },
            keys.jwt,
            { expiresIn: Date.now() + 3600000 } //'1h'
          ) //one hour
          res.status(200).json({ token: `Bearer ${token}`, userId: userData.rows[0].id, })
        } else {
          res.status(401).json({
            text: 'uncorrect password',
          })
        }
      } else {
        res.status(400).json({ text: 'email is not confirmed' })
      }
    } else {
      res.status(400).json({ text: 'uncorrect email or loggin' })
    }
    res.end()
  }
  async logout(req, res) {
    //logout on front-end by deleting token from cookie
    res.status(200)
    res.end()
  }
  //
  //
  async resetPassword(req, res) {
    const { email } = req.body
    const userData = await db.query(
      'SELECT * FROM users WHERE email=$1;',
      [email]
    )
    const token = jwt.sign(
      {
        email: email,
        userId: userData.rows[0].id,
        expiresIn: Date.now() + 3600000,
      },
      keys.jwt,
      { expiresIn: '1h' }
    ) //one hour
    const message = {
      to: email,
      subject: '[USOF:dgorkavyi]Reset password...',
      html: `
        <h1>Лови жабу...</h1>
        <h2>То есть ссылку на восттановление пароля=)</h2>
        <h2>
          <a href="http://localhost:8080/api/auth/password-reset-test/${token}">
            http://localhost:8080/api/auth/password-reset/${token}
          </a>
        </h2>     
      `, // html body
    }
    mailer(message)
    res.end()
  }
  //
  //
  async testResetPassForm(req, res) {
    const token = req.params.token

    res.send(`
      <form method="POST" name="reset-password" action="/api/auth/password-reset/${token}">
        <lable for="newpass">New Password: </label><input name="newPassword" type="text" id="newpass">
        <input type="submit" value="Отправить" />
      </form>
    `)
    res.end()
  }
  //
  //
  async confirmNewPasswprd(req, res) {
    const token = req.params.token
    const decoded = jwt.verify(token, keys.jwt)
    const salt = bcrypt.genSaltSync(10)
    const newPassword = bcrypt.hashSync(req.body.newPassword, salt)
    const query = {
      text: 'UPDATE users SET password=$1 WHERE id=$2;',
      values: [newPassword, decoded.userId],
    }

    if (req.body.newPassword.length >= 6) {
      await db.query(query)
      res.status(200)
      res.send(
        '<h1>Короче меченый, я тебя спас и в благородство играть не буду... =)</h1>'
      )
      res.end()
    } else {
      res.status(400)
      res.redirect(`/api/auth/password-reset/${token}`)
    }
    res.end()
  }
  //
  //
  async emailConfirm(req, res) {
    const token = req.params.token
    const decoded = jwt.verify(token, keys.jwt)
    const query = {
      text: 'UPDATE users SET email_confirm=$1 WHERE id=$2;',
      values: [true, decoded.userId],
    }

    await db.query(query)
    res.status(200)
    res.send('<h1>Почта подтверждена. Можешь заходить</h1>')
    res.end()
  }

  async checkToken(req, res) {
    const token = req.params.token
    const decoded = token !== 'undefined' ? jwt.verify(token.split(' ')[1], keys.jwt) : '\tundefined!!'

    if (Date.now() - decoded.expiresIn > 0) {
      res.status(200).json({text: false})
    } else {
      res.status(200).json({text: true})
    }
  }
}

module.exports = AuthController
