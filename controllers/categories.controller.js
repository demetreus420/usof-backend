const db = require('../model/db')

class CategoryController {
  //------------------------------------------------------//
  //
  async getAll(req, res) {
      const { rows } = await db.query('SELECT * FROM categories;')

      if (!!rows[0]) {
        res.status(200)
        res.send(rows)
      } else {
        res.send([])
      }
    res.end()
  }
  //------------------------------------------------------//
  //
  async getSpecified(req, res) {
      const id = req.params.id
      const {
        rows,
      } = await db.query('SELECT * FROM categories WHERE id=$1;', [
        id,
      ])

      if (!!rows[0]) {
        res.status(200)
        res.send(rows)
      } else {
        res.status(400)
      }
    res.end()
  }
  //------------------------------------------------------//
  //
  async getPostsWithCategory(req, res) {

      const id = req.params.id
      const {
        rows,
      } = await db.query('SELECT * FROM categories WHERE id=$1;', [
        id,
      ])
      const posts = await db.query(
        'SELECT * FROM posts WHERE $1=ANY(category);',
        [rows[0].title]
      )

      if (!!rows[0] && !!posts.rows[0]) {
        res.status(200)
        res.send(posts.rows)
      } else {
        res.status(400)
        res.send([]);
      }
    res.end()
  }
  //------------------------------------------------------//
  //
  async createNewOne(req, res) {
    const { title, description } = req.body

    const checkCategory = await db.query(
      'SELECT * FROM categories WHERE title=$1;',
      [title]
    )

    if (!checkCategory.rows[0]) {
      await db.query(
        'INSERT INTO categories(title, descript) VALUES($1, $2);',
        [title, description]
      )
      res.status(200)
    } else {
      res.status(400)
    }

    res.end()
  }
  //------------------------------------------------------//
  //
  async updateSpecified(req, res) {
    if (req.body.user_role == 'admin') {
      const id = req.params.id
      const { title, description } = req.body
      const checkCategory = await db.query(
        'SELECT * FROM categories WHERE id=$1;',
        [id]
      )
      if (!!checkCategory.rows[0]) {
        await db.query(
          'UPDATE categories SET title=$1, descript=$2 WHERE id=$3;',
          [title, description, id]
        )
        res.status(200)
      } else {
        res.status(400)
      }
    }
    res.end()
  }
  //------------------------------------------------------//
  //
  async deleteSpecified(req, res) {
    if (req.body.user_role == 'admin') {
      const id = req.params.id
      const checkCategory = await db.query(
        'SELECT * FROM categories WHERE id=$1;',
        [id]
      )
      if (!!checkCategory.rows[0]) {
        await db.query('DELETE FROM categories WHERE id=$1;', [id])
        res.status(200)
      } else {
        res.status(400)
      }
    }
    res.end()
  }
  //------------------------------------------------------//
  //
}

module.exports = CategoryController
