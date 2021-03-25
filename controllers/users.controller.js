const db = require('../model/db')
const fs = require('fs')
const bcrypt = require('bcryptjs');
const { Console } = require('console');

class UserController {
  //------------------------------------------------------//
  //
  async getAll(req, res) {
    const adminQuery = 'SELECT * FROM users;';
    const userQuery = 'SELECT id, fullname, role, profilepic, login, rating FROM users;';

    if (req.user && req.user.role == 'admin') {
      const all = await db.query(adminQuery)

      console.log('-->  ', req.user.role)
      if (all.rows.length == 0) {
        res.status(400)
      } else {
        res.status(200)
        res.send(all.rows)
      }
    } else {
      const all = await db.query(userQuery)
      if (all.rows.length == 0) {
        res.status(400)
        res.send([])
      } else {
        res.status(200)
        res.send(all.rows)
      }
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async getSpecified(req, res) {
    const id = req.params.id
    const user = await db.query(
      'SELECT id, login, fullname, email, role, about, location, rating, profilepic FROM users where id = $1;',
      [id]
    )
    
    if (user.rows.length == 0) {
      res.status(400)
    } else {
      res.status(200).json(user.rows[0])
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async createNewOne(req, res) {
    if (req.user.role == 'admin') {
      let {
        login,
        password,
        passwordConfirm,
        fullname,
        email,
        role,
      } = req.body
      const loginEmailCheck = await db.query(
        'SELECT * FROM users WHERE login=$1 OR email=$2;',
        [login, email]
      )

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
        await db.query(
          `INSERT INTO users (login, password, email, role, fullname)
        VALUES($1, $2, $3, $4, $5) RETURNING *;`,
          [login, password, email, role, fullname]
        )
        res.status(200)
      }
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async uploadAvatar(req, res) {
    if (req.user.role == 'admin') {
      let dirpath = __dirname.replace('controllers', '')
      const path = req.files[0].path
      const id = req.body.id
      const userExt = await db.query(
        'SELECT * FROM users WHERE id=$1;',
        [id]
      )

      if (!req.files || id < 1 || !userExt.rows[0]) {
        fs.unlinkSync(dirpath + req.files[0].path)
        res.status(400)
      } else {
        const oldPath = await db.query(
          'SELECT profilepic FROM users WHERE id=$1;',
          [id]
        )

        if (!!oldPath.rows[0]) {
          fs.unlink(dirpath + oldPath.rows[0].profilepic, (err) => {})
        }

        await db.query(
          'UPDATE users set profilepic=$1 WHERE id=$2;',
          [path, id]
        )
        res.status(200)
      }
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async updateSpecified(req, res) {
    const id = req.params.id
    const checkId = await db.query(
      'SELECT * FROM users WHERE id=$1;',
      [id]
    )
    let { login, email, location, role, about, fullName } = req.body

    if (!checkId.rows[0]) {
      res.status(400).json({text: "NO ID"})
    } else {
      let row = await db.query(
        `UPDATE users SET login=$1, email=$2, role=$3, fullname=$4, location=$5, about=$6 
      WHERE id=$7 RETURNING *;`,
        [login, email, role, fullName, location, about, id]
      )
      row = row.rows[0]
      row = {
        login: row.login,
        email: row.email,
        id: row.id,
        role: row.role,
        fullname: row.fullname,
        about: row.about,
        location: row.location
      }
      console.log(row)
      res.status(200).json(row)
    }

    res.end()
  }
  //------------------------------------------------------//
  //
  async deleteSpecified(req, res) {
    if (req.user.role == 'admin') {
      const id = req.params.id
      let deleted = await db.query(
        'SELECT * FROM users WHERE id=$1;',
        [id]
      )

      //console.log(deleted)
      if (deleted.rows.length == 0) {
        res.status(400)
      } else {
        deleted = await db.query(
          'DELETE FROM users WHERE id=$1 RETURNING *;',
          [id]
        )
        res.status(200)
      }
    }
    res.end()
  }
  //------------------------------------------------------//
  //
}

module.exports = UserController
